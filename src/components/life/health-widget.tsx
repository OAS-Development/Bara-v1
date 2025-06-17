'use client'

import React from 'react'
import { useHealthStore } from '@/stores/health-store'
import { useHabitStore } from '@/stores/habit-store'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Heart, TrendingUp, Flame, Activity } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { format } from 'date-fns'

export function HealthWidget() {
  const router = useRouter()
  const { metrics, getLatestMetric } = useHealthStore()
  const { habits, getStreak } = useHabitStore()

  const latestWeight = getLatestMetric('weight')
  const latestSleep = getLatestMetric('sleep_hours')
  const activeHabits = habits.filter((h) => h.active)
  const longestStreak = Math.max(...activeHabits.map((h) => getStreak(h.id)), 0)

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-red-500" />
            Health & Wellness
          </span>
          <Button variant="ghost" size="sm" onClick={() => router.push('/life/health')}>
            View All →
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Current Weight</p>
            <p className="text-2xl font-bold">
              {latestWeight ? `${latestWeight.value} ${latestWeight.unit}` : '--'}
            </p>
            {latestWeight && (
              <p className="text-xs text-muted-foreground">
                {format(new Date(latestWeight.recorded_at), 'MMM d')}
              </p>
            )}
          </div>

          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Last Night&apos;s Sleep</p>
            <p className="text-2xl font-bold">{latestSleep ? `${latestSleep.value}h` : '--'}</p>
            {latestSleep && (
              <p className="text-xs text-muted-foreground">
                {format(new Date(latestSleep.recorded_at), 'MMM d')}
              </p>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Active Habits</span>
            <Badge variant="secondary">{activeHabits.length}</Badge>
          </div>

          {longestStreak > 0 && (
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground flex items-center gap-1">
                <Flame className="w-4 h-4 text-orange-500" />
                Longest Streak
              </span>
              <span className="text-sm font-medium">{longestStreak} days</span>
            </div>
          )}
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="flex-1"
            onClick={() => router.push('/life/health?tab=metrics')}
          >
            <Activity className="w-4 h-4 mr-1" />
            Add Metric
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="flex-1"
            onClick={() => router.push('/life/health?tab=habits')}
          >
            Track Habits
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
