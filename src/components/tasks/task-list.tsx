'use client'

import { useEffect } from 'react'
import { Check, Circle } from 'lucide-react'
import { useTaskStore } from '@/stores/task-store'
import { cn } from '@/lib/utils'

export function TaskList() {
  const { tasks, isLoading, selectedTaskId, fetchTasks, toggleTask, selectTask } = useTaskStore()

  useEffect(() => {
    fetchTasks()
  }, [fetchTasks])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-gray-500">Loading tasks...</p>
      </div>
    )
  }

  if (tasks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <p className="text-gray-500 mb-2">No tasks yet</p>
        <p className="text-sm text-gray-600">Press Cmd+N to create your first task</p>
      </div>
    )
  }

  return (
    <div className="flex-1 overflow-y-auto">
      {tasks.map((task) => (
        <div
          key={task.id}
          onClick={() => selectTask(task.id)}
          className={cn(
            'flex items-start gap-3 px-4 py-3 border-b border-gray-800 cursor-pointer hover:bg-gray-800/50',
            selectedTaskId === task.id && 'bg-gray-800'
          )}
        >
          <button
            onClick={(e) => {
              e.stopPropagation()
              toggleTask(task.id)
            }}
            className="mt-0.5 flex-shrink-0"
          >
            {task.status === 'completed' ? (
              <Check className="w-5 h-5 text-blue-500" />
            ) : (
              <Circle className="w-5 h-5 text-gray-600 hover:text-gray-400" />
            )}
          </button>
          
          <div className="flex-1 min-w-0">
            <h3 className={cn(
              'text-sm',
              task.status === 'completed' && 'line-through text-gray-500'
            )}>
              {task.title}
            </h3>
            {task.note && (
              <p className="text-xs text-gray-500 mt-1">{task.note}</p>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}