'use client'

import React, { useMemo } from 'react'
import { JournalEntry } from '@/stores/journal-store'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react'
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  addMonths,
  subMonths
} from 'date-fns'
import { cn } from '@/lib/utils'

interface JournalCalendarProps {
  entries: JournalEntry[]
  selectedDate?: Date
  onDateSelect?: (date: Date) => void
}

const moodColors = {
  happy: 'bg-yellow-200',
  neutral: 'bg-gray-200',
  sad: 'bg-blue-200',
  anxious: 'bg-purple-200',
  excited: 'bg-green-200',
  angry: 'bg-red-200',
  calm: 'bg-cyan-200'
}

export function JournalCalendar({
  entries,
  selectedDate = new Date(),
  onDateSelect
}: JournalCalendarProps) {
  const [currentMonth, setCurrentMonth] = React.useState(startOfMonth(selectedDate))

  const entriesMap = useMemo(() => {
    const map = new Map<string, JournalEntry>()
    entries.forEach((entry) => {
      map.set(entry.entry_date, entry)
    })
    return map
  }, [entries])

  const days = useMemo(() => {
    const start = startOfMonth(currentMonth)
    const end = endOfMonth(currentMonth)
    const daysArray = eachDayOfInterval({ start, end })

    // Add padding days from previous month
    const startDayOfWeek = start.getDay()
    for (let i = 0; i < startDayOfWeek; i++) {
      daysArray.unshift(new Date(start.getFullYear(), start.getMonth(), -i))
    }

    // Add padding days from next month
    while (daysArray.length % 7 !== 0) {
      daysArray.push(
        new Date(
          end.getFullYear(),
          end.getMonth() + 1,
          daysArray.length - endOfMonth(currentMonth).getDate() + 1
        )
      )
    }

    return daysArray
  }, [currentMonth])

  const handlePreviousMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1))
  }

  const handleNextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1))
  }

  const handleToday = () => {
    setCurrentMonth(startOfMonth(new Date()))
    onDateSelect?.(new Date())
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Journal Calendar
          </span>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" onClick={handlePreviousMonth}>
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <span className="text-sm font-medium min-w-[120px] text-center">
              {format(currentMonth, 'MMMM yyyy')}
            </span>
            <Button variant="outline" size="icon" onClick={handleNextMonth}>
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-7 gap-1 mb-2">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
            <div key={day} className="text-center text-xs font-medium text-muted-foreground p-2">
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1">
          {days.map((day, index) => {
            const dateString = format(day, 'yyyy-MM-dd')
            const entry = entriesMap.get(dateString)
            const isCurrentMonth = isSameMonth(day, currentMonth)
            const isSelected = selectedDate && isSameDay(day, selectedDate)
            const isToday = isSameDay(day, new Date())

            return (
              <Button
                key={index}
                variant="ghost"
                className={cn(
                  'h-12 p-0 relative hover:bg-accent',
                  !isCurrentMonth && 'text-muted-foreground opacity-50',
                  isSelected && 'ring-2 ring-primary',
                  isToday && 'bg-accent'
                )}
                onClick={() => onDateSelect?.(day)}
              >
                <div className="w-full h-full flex flex-col items-center justify-center relative">
                  <span className="text-sm">{format(day, 'd')}</span>
                  {entry && (
                    <div
                      className={cn(
                        'absolute bottom-1 w-2 h-2 rounded-full',
                        entry.mood ? moodColors[entry.mood] : 'bg-primary'
                      )}
                    />
                  )}
                </div>
              </Button>
            )
          })}
        </div>

        <div className="mt-4 flex justify-between items-center">
          <Button variant="outline" size="sm" onClick={handleToday}>
            Today
          </Button>

          <div className="text-xs text-muted-foreground">{entries.length} entries this month</div>
        </div>

        <div className="mt-4 flex flex-wrap gap-2 text-xs">
          <span className="text-muted-foreground">Mood indicators:</span>
          {Object.entries(moodColors).map(([mood, color]) => (
            <div key={mood} className="flex items-center gap-1">
              <div className={cn('w-3 h-3 rounded-full', color)} />
              <span className="capitalize">{mood}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
