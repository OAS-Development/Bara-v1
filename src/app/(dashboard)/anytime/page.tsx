'use client'

import { useEffect, useState, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { TaskList } from '@/components/tasks/task-list'
import { Archive } from 'lucide-react'
import { AsyncErrorBoundary } from '@/components/error-boundary'

function AnytimePageContent() {
  const [taskCount, setTaskCount] = useState(0)
  const supabase = createClient()

  const fetchTaskCount = useCallback(async () => {
    const { count } = await supabase
      .from('tasks')
      .select('id', { count: 'exact', head: true })
      .eq('status', 'active')
      .is('due_date', null)
      .or(`defer_date.is.null,defer_date.lte.${new Date().toISOString()}`)

    setTaskCount(count || 0)
  }, [supabase])

  useEffect(() => {
    fetchTaskCount()
  }, [fetchTaskCount])

  return (
    <div className="flex h-full">
      <div className="flex-1 flex flex-col">
        <div className="border-b px-6 py-4">
          <div className="flex items-center gap-3">
            <Archive className="h-6 w-6 text-gray-400" />
            <div>
              <h1 className="text-2xl font-semibold">Anytime</h1>
              <p className="text-sm text-gray-500">
                {taskCount} task{taskCount !== 1 ? 's' : ''} available anytime
              </p>
            </div>
          </div>
        </div>

        <TaskList />
      </div>
    </div>
  )
}

export default function AnytimePage() {
  return (
    <AsyncErrorBoundary>
      <AnytimePageContent />
    </AsyncErrorBoundary>
  )
}
