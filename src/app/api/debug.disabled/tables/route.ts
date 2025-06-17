import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const supabase = createRouteHandlerClient({ cookies })

    // Check auth
    const {
      data: { user }
    } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    // Test each table
    const tables = ['projects', 'tasks', 'tags', 'task_tags', 'perspectives']
    const results: Record<string, any> = {}

    for (const table of tables) {
      try {
        const { data, error } = await supabase.from(table).select('*').limit(1)

        results[table] = {
          exists: !error,
          error: error?.message || null,
          hasData: data && data.length > 0
        }
      } catch (e) {
        results[table] = {
          exists: false,
          error: e instanceof Error ? e.message : 'Unknown error',
          hasData: false
        }
      }
    }

    return NextResponse.json({
      tables: results,
      user: user.email,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Server error' },
      { status: 500 }
    )
  }
}
