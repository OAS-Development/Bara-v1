'use client'

import React, { useMemo } from 'react'
import { JournalEntry } from '@/stores/journal-store'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { SmilePlus } from 'lucide-react'

interface MoodTrackerProps {
  entries: JournalEntry[]
  days?: number
}

const moodConfig = {
  happy: { emoji: '😊', color: '#fbbf24', label: 'Happy' },
  neutral: { emoji: '😐', color: '#9ca3af', label: 'Neutral' },
  sad: { emoji: '😢', color: '#3b82f6', label: 'Sad' },
  anxious: { emoji: '😰', color: '#a855f7', label: 'Anxious' },
  excited: { emoji: '🎉', color: '#10b981', label: 'Excited' },
  angry: { emoji: '😠', color: '#ef4444', label: 'Angry' },
  calm: { emoji: '😌', color: '#06b6d4', label: 'Calm' }
}

export function MoodTracker({ entries, days = 30 }: MoodTrackerProps) {
  const moodData = useMemo(() => {
    const cutoffDate = new Date()
    cutoffDate.setDate(cutoffDate.getDate() - days)

    const recentEntries = entries.filter(
      (entry) => new Date(entry.entry_date) >= cutoffDate && entry.mood
    )

    // Count moods
    const moodCounts = recentEntries.reduce(
      (acc, entry) => {
        if (entry.mood) {
          acc[entry.mood] = (acc[entry.mood] || 0) + 1
        }
        return acc
      },
      {} as Record<string, number>
    )

    // Convert to chart data
    return Object.entries(moodConfig).map(([mood, config]) => ({
      mood: config.label,
      emoji: config.emoji,
      count: moodCounts[mood] || 0,
      fill: config.color
    }))
  }, [entries, days])

  const totalMoodEntries = moodData.reduce((sum, item) => sum + item.count, 0)
  const dominantMood = moodData.reduce((prev, current) =>
    current.count > prev.count ? current : prev
  )

  if (totalMoodEntries === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <SmilePlus className="w-5 h-5" />
            Mood Tracker
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <p>No mood data available yet.</p>
            <p className="text-sm mt-2">Start tracking your mood with journal entries!</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <SmilePlus className="w-5 h-5" />
            Mood Tracker
          </span>
          <Badge variant="secondary" className="text-xs">
            Last {days} days
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-center">
          <div className="text-4xl mb-2">{dominantMood.emoji}</div>
          <p className="text-sm text-muted-foreground">
            Your dominant mood has been <span className="font-medium">{dominantMood.mood}</span>
          </p>
        </div>

        <div className="h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={moodData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis dataKey="emoji" tick={{ fontSize: 20 }} />
              <YAxis tick={{ fill: 'currentColor', fontSize: 12 }} />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload[0]) {
                    const data = payload[0].payload
                    return (
                      <div className="bg-background border rounded-lg p-2 shadow-lg">
                        <p className="font-medium">{data.mood}</p>
                        <p className="text-sm text-muted-foreground">
                          {data.count} {data.count === 1 ? 'entry' : 'entries'}
                        </p>
                      </div>
                    )
                  }
                  return null
                }}
              />
              <Bar dataKey="count" fill="currentColor" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="grid grid-cols-2 gap-2 text-sm">
          {moodData
            .filter((m) => m.count > 0)
            .map((mood) => (
              <div
                key={mood.mood}
                className="flex items-center justify-between p-2 rounded-lg bg-muted"
              >
                <span className="flex items-center gap-2">
                  <span className="text-lg">{mood.emoji}</span>
                  {mood.mood}
                </span>
                <Badge variant="secondary">{mood.count}</Badge>
              </div>
            ))}
        </div>
      </CardContent>
    </Card>
  )
}
