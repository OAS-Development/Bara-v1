'use client'

import { useEffect, useState, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Flag } from 'lucide-react'

export default function SomedayPage() {
  const [projectCount, setProjectCount] = useState(0)
  const supabase = createClient()

  const fetchOnHoldProjects = useCallback(async () => {
    const { count } = await supabase
      .from('projects')
      .select('id', { count: 'exact', head: true })
      .eq('status', 'on-hold')

    setProjectCount(count || 0)
  }, [supabase])

  useEffect(() => {
    fetchOnHoldProjects()
  }, [fetchOnHoldProjects])

  return (
    <div className="flex h-full">
      <div className="flex-1 flex flex-col">
        <div className="border-b px-6 py-4">
          <div className="flex items-center gap-3">
            <Flag className="h-6 w-6 text-gray-400" />
            <div>
              <h1 className="text-2xl font-semibold">Someday</h1>
              <p className="text-sm text-gray-500">
                {projectCount} project{projectCount !== 1 ? 's' : ''} on hold
              </p>
            </div>
          </div>
        </div>

        <div className="flex-1 p-6">
          <p className="text-gray-500">
            Projects marked as &quot;On Hold&quot; will appear here. These are projects you might do
            someday but aren&apos;t committed to yet.
          </p>
        </div>
      </div>
    </div>
  )
}
