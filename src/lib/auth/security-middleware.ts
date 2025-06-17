import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { SECURITY_CONFIG } from './security-config'

// In-memory store for security events (in production, use database)
const securityEvents: SecurityEvent[] = []
const failedAttempts = new Map<string, number>()
const lockouts = new Map<string, number>()

interface SecurityEvent {
  type: 'UNAUTHORIZED_ACCESS' | 'FAILED_LOGIN' | 'LOCKOUT' | 'SUSPICIOUS_ACTIVITY'
  attemptedUserId?: string
  attemptedEmail?: string
  ip?: string
  userAgent?: string
  path?: string
  timestamp: Date
}

export async function logSecurityEvent(event: SecurityEvent) {
  securityEvents.push(event)
  console.error(`[SECURITY] ${event.type}:`, event)

  // Trim old events (keep last 1000)
  if (securityEvents.length > 1000) {
    securityEvents.splice(0, securityEvents.length - 1000)
  }
}

export function getSecurityEvents() {
  return [...securityEvents].reverse()
}

export async function securityMiddleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname
  const ip = request.ip || request.headers.get('x-forwarded-for') || 'unknown'
  const userAgent = request.headers.get('user-agent') || 'unknown'

  // Check if IP is locked out
  const lockoutTime = lockouts.get(ip)
  if (lockoutTime && Date.now() < lockoutTime) {
    await logSecurityEvent({
      type: 'LOCKOUT',
      ip,
      userAgent,
      path: pathname,
      timestamp: new Date()
    })

    return new NextResponse('Access Denied: Too many failed attempts', { status: 403 })
  }

  // Allow public routes
  if (SECURITY_CONFIG.PUBLIC_ROUTES.includes(pathname)) {
    return null // Allow access
  }

  // Get user from Supabase
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll() {
          // Not needed for reading
        }
      }
    }
  )

  const {
    data: { user },
    error
  } = await supabase.auth.getUser()

  if (error || !user) {
    await logSecurityEvent({
      type: 'UNAUTHORIZED_ACCESS',
      ip,
      userAgent,
      path: pathname,
      timestamp: new Date()
    })

    return NextResponse.redirect(new URL('/login', request.url))
  }

  // CRITICAL: Verify user is the owner
  if (SECURITY_CONFIG.OWNER_USER_ID && user.id !== SECURITY_CONFIG.OWNER_USER_ID) {
    await logSecurityEvent({
      type: 'UNAUTHORIZED_ACCESS',
      attemptedUserId: user.id,
      attemptedEmail: user.email,
      ip,
      userAgent,
      path: pathname,
      timestamp: new Date()
    })

    // Sign out the unauthorized user
    await supabase.auth.signOut()

    return new NextResponse('Access Denied: Unauthorized User', { status: 403 })
  }

  // If OWNER_USER_ID is not set, log a warning but allow access (degraded mode)
  if (!SECURITY_CONFIG.OWNER_USER_ID) {
    console.warn('WARNING: OWNER_USER_ID not set - running in degraded security mode')
  }

  // Reset failed attempts for successful auth
  failedAttempts.delete(ip)

  return null // Allow access
}

export async function trackFailedLogin(email: string, ip: string) {
  const attempts = (failedAttempts.get(ip) || 0) + 1
  failedAttempts.set(ip, attempts)

  await logSecurityEvent({
    type: 'FAILED_LOGIN',
    attemptedEmail: email,
    ip,
    timestamp: new Date()
  })

  // Lockout after too many attempts
  if (attempts >= SECURITY_CONFIG.AUTO_LOCKDOWN_AFTER_FAILED_ATTEMPTS) {
    lockouts.set(ip, Date.now() + SECURITY_CONFIG.LOCKDOWN_DURATION_MS)
    await logSecurityEvent({
      type: 'LOCKOUT',
      ip,
      timestamp: new Date()
    })
  }
}
