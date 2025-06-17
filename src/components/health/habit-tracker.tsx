'use client'

import React, { useEffect, useState } from 'react'
import { useHabitStore } from '@/stores/habit-store'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { Check, X, Flame, Calendar, Plus } from 'lucide-react'
import { format, startOfWeek, addDays, isSameDay } from 'date-fns'

interface HabitTrackerProps {
  onAddHabit?: () => void
}

export function HabitTracker({ onAddHabit }: HabitTrackerProps) {
  const {
    habits,
    completions,
    fetchHabits,
    fetchCompletions,
    recordCompletion,
    removeCompletion,
    isHabitCompletedForDate,
    getStreak
  } = useHabitStore()
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [weekDates, setWeekDates] = useState<Date[]>([])

  useEffect(() => {
    fetchHabits()
    fetchCompletions()
  }, [fetchHabits, fetchCompletions])

  useEffect(() => {
    const startDate = startOfWeek(selectedDate, { weekStartsOn: 0 })
    const dates = Array.from({ length: 7 }, (_, i) => addDays(startDate, i))
    setWeekDates(dates)
  }, [selectedDate])

  const activeHabits = habits.filter((h) => h.active)

  const handleToggleCompletion = async (habitId: string, date: Date) => {
    const completions = useHabitStore.getState().getHabitCompletionsForDate(habitId, date)

    if (completions.length > 0) {
      await removeCompletion(completions[0].id)
    } else {
      await recordCompletion(habitId)
    }
  }

  if (activeHabits.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Habit Tracker</span>
            <Button onClick={onAddHabit} size="sm">
              <Plus className="w-4 h-4 mr-1" />
              Add Habit
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <p>No active habits yet.</p>
            <p className="text-sm mt-2">Create your first habit to start tracking!</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Habit Tracker</span>
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">
              Week of {format(weekDates[0], 'MMM d')}
            </span>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-8 gap-2 text-sm">
            <div className="font-medium">Habit</div>
            {weekDates.map((date) => (
              <div key={date.toISOString()} className="text-center">
                <div className="font-medium">{format(date, 'EEE')}</div>
                <div
                  className={cn(
                    'text-xs',
                    isSameDay(date, new Date()) && 'text-primary font-semibold'
                  )}
                >
                  {format(date, 'd')}
                </div>
              </div>
            ))}
          </div>

          {activeHabits.map((habit) => {
            const streak = getStreak(habit.id)
            return (
              <div key={habit.id} className="grid grid-cols-8 gap-2 items-center">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium truncate">{habit.name}</span>
                  {streak > 0 && (
                    <Badge variant="secondary" className="text-xs">
                      <Flame className="w-3 h-3 mr-1" />
                      {streak}
                    </Badge>
                  )}
                </div>

                {weekDates.map((date) => {
                  const isCompleted = isHabitCompletedForDate(habit.id, date)
                  const isFuture = date > new Date()

                  return (
                    <Button
                      key={`${habit.id}-${date.toISOString()}`}
                      variant={isCompleted ? 'default' : 'outline'}
                      size="icon"
                      className={cn(
                        'h-8 w-8',
                        isCompleted &&
                          habit.color &&
                          `bg-${habit.color}-500 hover:bg-${habit.color}-600`
                      )}
                      onClick={() => handleToggleCompletion(habit.id, date)}
                      disabled={isFuture}
                    >
                      {isCompleted ? (
                        <Check className="w-4 h-4" />
                      ) : (
                        <X className="w-4 h-4 text-muted-foreground" />
                      )}
                    </Button>
                  )
                })}
              </div>
            )
          })}
        </div>

        <div className="mt-4 pt-4 border-t">
          <Button onClick={onAddHabit} variant="outline" size="sm" className="w-full">
            <Plus className="w-4 h-4 mr-1" />
            Add New Habit
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
