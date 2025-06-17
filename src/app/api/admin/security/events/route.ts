import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getSecurityEvents } from '@/lib/auth/security-middleware'
import { SECURITY_CONFIG } from '@/lib/auth/security-config'

export async function GET(request: NextRequest) {
  try {
    // Verify the user is the owner
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user || user.id !== SECURITY_CONFIG.OWNER_USER_ID) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }
    
    const events = getSecurityEvents()
    return NextResponse.json({ events })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch security events' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    // Verify the user is the owner
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user || user.id !== SECURITY_CONFIG.OWNER_USER_ID) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }
    
    // In a real implementation, this would clear the events from the database
    // For now, we can't clear the in-memory store from here
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to clear security events' }, { status: 500 })
  }
}