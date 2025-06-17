'use client'

import { useEffect, useState } from 'react'
import { useTaskStore } from '@/stores/task-store'
import { createClient } from '@/lib/supabase/client'
import { Database } from '@/types/database.types'
import { Check, Circle, Calendar, AlertCircle, Folder } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useProjectStore } from '@/stores/project-store'
import { useTagStore } from '@/stores/tag-store'
import { TagChip } from '@/components/tags/tag-chip'

type Task = Database['public']['Tables']['tasks']['Row']

interface TaskWithTags extends Task {
  tags?: string[]
}

export function TodayView() {
  const [tasks, setTasks] = useState<TaskWithTags[]>([])
  const [loading, setLoading] = useState(true)
  const { toggleTask, selectTask, selectedTaskId } = useTaskStore()
  const { projects } = useProjectStore()
  const { tags } = useTagStore()
  const supabase = createClient()

  useEffect(() => {
    fetchTodayTasks()
  }, [])

  const fetchTodayTasks = async () => {
    setLoading(true)
    const now = new Date()
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString()
    const todayEnd = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1).toISOString()

    // Fetch tasks that are either:
    // 1. Due today
    // 2. Available (not deferred or defer date has passed) and not completed
    const { data: tasks, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('status', 'active')
      .or(`due_date.gte.${todayStart},due_date.lt.${todayEnd}`)
      .or(`defer_date.is.null,defer_date.lte.${now.toISOString()}`)
      .order('due_date', { ascending: true, nullsFirst: false })
      .order('position')

    if (error) {
      console.error('Error fetching today tasks:', error)
      setLoading(false)
      return
    }

    // Filter for tasks that are actually due today or overdue
    const todayTasks = tasks?.filter(task => {
      const isDueToday = task.due_date && 
        new Date(task.due_date) >= new Date(todayStart) && 
        new Date(task.due_date) < new Date(todayEnd)
      const isOverdue = task.due_date && new Date(task.due_date) < new Date(todayStart)
      const isAvailable = !task.defer_date || new Date(task.defer_date) <= now
      
      return (isDueToday || isOverdue) && isAvailable
    }) || []

    // Fetch tags for tasks
    if (todayTasks.length > 0) {
      const { data: taskTags } = await supabase
        .from('task_tags')
        .select('task_id, tag_id')
        .in('task_id', todayTasks.map(t => t.id))

      const tagsByTask = taskTags?.reduce((acc, tt) => {
        if (!acc[tt.task_id]) acc[tt.task_id] = []
        acc[tt.task_id].push(tt.tag_id)
        return acc
      }, {} as Record<string, string[]>) || {}

      const tasksWithTags = todayTasks.map(task => ({
        ...task,
        tags: tagsByTask[task.id] || []
      }))

      setTasks(tasksWithTags)
    } else {
      setTasks([])
    }
    
    setLoading(false)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-gray-500">Loading today&apos;s tasks...</p>
      </div>
    )
  }

  if (tasks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <Calendar className="h-12 w-12 text-gray-400 mb-4" />
        <p className="text-gray-500 mb-2">No tasks for today</p>
        <p className="text-sm text-gray-600">Tasks with due dates will appear here</p>
      </div>
    )
  }

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="p-4">
        <h2 className="text-lg font-semibold mb-4">Today</h2>
        <p className="text-sm text-gray-500 mb-4">
          {tasks.length} task{tasks.length !== 1 ? 's' : ''} due today
        </p>
      </div>
      
      {tasks.map((task) => {
        const isOverdue = task.due_date && new Date(task.due_date) < new Date()
        
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
                  {isOverdue && (
                    <div className="flex items-center gap-1 text-red-400">
                      <AlertCircle className="h-3 w-3" />
                      <span className="text-xs">Overdue</span>
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