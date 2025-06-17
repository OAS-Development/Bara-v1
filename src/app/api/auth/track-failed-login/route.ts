import { NextRequest, NextResponse } from 'next/server'
import { trackFailedLogin } from '@/lib/auth/security-middleware'

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()
    const ip = request.ip || request.headers.get('x-forwarded-for') || 'unknown'

    await trackFailedLogin(email, ip)

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to track login attempt' }, { status: 500 })
  }
}
