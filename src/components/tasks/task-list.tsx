'use client'

import { useEffect } from 'react'
import { Check, Circle, Folder, Calendar, AlertCircle } from 'lucide-react'
import { useTaskStore } from '@/stores/task-store'
import { useProjectStore } from '@/stores/project-store'
import { useTagStore } from '@/stores/tag-store'
import { TagChip } from '@/components/tags/tag-chip'
import { cn } from '@/lib/utils'

export function TaskList() {
  const { tasks, isLoading, selectedTaskId, fetchTasks, toggleTask, selectTask } = useTaskStore()
  const { projects, fetchProjects } = useProjectStore()
  const { tags, fetchTags } = useTagStore()

  useEffect(() => {
    fetchTasks()
    fetchProjects()
    fetchTags()
  }, [fetchTasks, fetchProjects, fetchTags])

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
      {tasks.map((task) => {
        const isOverdue = task.due_date && new Date(task.due_date) < new Date() && task.status === 'active'
        const isDueToday = task.due_date && 
          new Date(task.due_date).toDateString() === new Date().toDateString()
        
        return (
          <div
            key={task.id}
            onClick={() => selectTask(task.id)}
            className={cn(
              'flex items-start gap-3 px-4 py-3 border-b border-gray-800 cursor-pointer hover:bg-gray-800/50',
              selectedTaskId === task.id && 'bg-gray-800',
              isOverdue && 'bg-red-950/20'
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
            <div className="space-y-1 mt-1">
              <div className="flex items-center gap-2">
                {task.project_id && (
                  <div className="flex items-center gap-1">
                    <Folder className="h-3 w-3 text-gray-500" />
                    <span className="text-xs text-gray-500">
                      {projects.find(p => p.id === task.project_id)?.name || 'Unknown Project'}
                    </span>
                  </div>
                )}
                {task.note && (
                  <span className="text-xs text-gray-500">• {task.note}</span>
                )}
                {task.due_date && (
                  <div className={cn(
                    "flex items-center gap-1",
                    isOverdue && "text-red-400",
                    isDueToday && !isOverdue && "text-yellow-400"
                  )}>
                    {isOverdue && <AlertCircle className="h-3 w-3" />}
                    <Calendar className="h-3 w-3" />
                    <span className="text-xs">
                      {new Date(task.due_date).toLocaleDateString()}
                    </span>
                  </div>
                )}
              </div>
              {task.tags && task.tags.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {task.tags.map(tagId => {
                    const tag = tags.find(t => t.id === tagId)
                    if (!tag) return null
                    return (
                      <TagChip
                        key={tag.id}
                        name={tag.name}
                        color={tag.color}
                        icon={tag.icon}
                      />
                    )
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
        )
      })}
    </div>
  )
}