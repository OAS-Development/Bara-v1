import { type NextRequest, NextResponse } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'
import { securityMiddleware } from '@/lib/auth/security-middleware'
import { validateSecurityConfig } from '@/lib/auth/security-config'

// Validate security config on middleware load
const isSecurityConfigValid = validateSecurityConfig()
if (!isSecurityConfigValid) {
  console.error('CRITICAL: Security configuration is invalid. System running in degraded mode.')
}

export async function middleware(request: NextRequest) {
  // Run security middleware first
  const securityResponse = await securityMiddleware(request)
  if (securityResponse) {
    return securityResponse
  }
  
  // Then run Supabase session update
  return await updateSession(request)
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - images - .svg, .png, .jpg, .jpeg, .gif, .webp
     * Feel free to modify this pattern to include more paths.
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}