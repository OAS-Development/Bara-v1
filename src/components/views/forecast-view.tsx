'use client'

import { useEffect, useState, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Database } from '@/types/database.types'
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

type Task = Database['public']['Tables']['tasks']['Row']

interface DayTasks {
  date: Date
  tasks: Task[]
}

export function ForecastView() {
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [monthTasks, setMonthTasks] = useState<DayTasks[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  const fetchMonthTasks = useCallback(async () => {
    setLoading(true)

    const monthStart = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1)
    const monthEnd = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0)

    const { data: tasks, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('status', 'active')
      .gte('due_date', monthStart.toISOString())
      .lte('due_date', monthEnd.toISOString())
      .order('due_date', { ascending: true })

    if (error) {
      console.error('Error fetching forecast tasks:', error)
      setLoading(false)
      return
    }

    // Group tasks by day
    const tasksByDay: Record<string, Task[]> = {}
    tasks?.forEach((task) => {
      if (task.due_date) {
        const dateKey = new Date(task.due_date).toDateString()
        if (!tasksByDay[dateKey]) {
          tasksByDay[dateKey] = []
        }
        tasksByDay[dateKey].push(task)
      }
    })

    // Create array of days with tasks
    const daysWithTasks: DayTasks[] = []
    for (let day = 1; day <= monthEnd.getDate(); day++) {
      const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day)
      const dateKey = date.toDateString()
      daysWithTasks.push({
        date,
        tasks: tasksByDay[dateKey] || []
      })
    }

    setMonthTasks(daysWithTasks)
    setLoading(false)
  }, [supabase, currentMonth])

  useEffect(() => {
    fetchMonthTasks()
  }, [fetchMonthTasks])

  const goToPreviousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))
  }

  const goToNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))
  }

  const monthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December'
  ]

  const getFirstDayOfMonth = () => {
    return new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).getDay()
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-gray-500">Loading forecast...</p>
      </div>
    )
  }

  return (
    <div className="flex-1 overflow-y-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold">Forecast</h2>
        <div className="flex items-center gap-4">
          <button onClick={goToPreviousMonth} className="p-2 hover:bg-gray-800 rounded">
            <ChevronLeft className="h-5 w-5" />
          </button>
          <h3 className="text-lg font-medium w-40 text-center">
            {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
          </h3>
          <button onClick={goToNextMonth} className="p-2 hover:bg-gray-800 rounded">
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
          <div key={day} className="text-center text-sm font-medium text-gray-500 p-2">
            {day}
          </div>
        ))}

        {/* Empty cells for days before month starts */}
        {Array.from({ length: getFirstDayOfMonth() }).map((_, i) => (
          <div key={`empty-${i}`} className="aspect-square" />
        ))}

        {/* Days of the month */}
        {monthTasks.map(({ date, tasks }) => {
          const isToday = date.toDateString() === new Date().toDateString()
          const isWeekend = date.getDay() === 0 || date.getDay() === 6
          const hasTasks = tasks.length > 0

          return (
            <div
              key={date.toISOString()}
              className={cn(
                'aspect-square border border-gray-800 rounded-lg p-2 transition-colors',
                isToday && 'border-blue-500 bg-blue-950/20',
                isWeekend && 'bg-gray-900',
                hasTasks && 'hover:bg-gray-800 cursor-pointer'
              )}
            >
              <div className="flex justify-between items-start">
                <span className={cn('text-sm', isToday && 'font-bold text-blue-400')}>
                  {date.getDate()}
                </span>
                {hasTasks && (
                  <span className="text-xs bg-blue-600 text-white px-1 rounded">
                    {tasks.length}
                  </span>
                )}
              </div>

              {hasTasks && (
                <div className="mt-1 space-y-1">
                  {tasks.slice(0, 3).map((task, i) => (
                    <div
                      key={task.id}
                      className="text-xs truncate text-gray-400"
                      title={task.title}
                    >
                      {task.title}
                    </div>
                  ))}
                  {tasks.length > 3 && (
                    <div className="text-xs text-gray-500">+{tasks.length - 3} more</div>
                  )}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
