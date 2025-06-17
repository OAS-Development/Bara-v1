'use client'

import React, { useEffect, useState } from 'react'
import { useJournalStore } from '@/stores/journal-store'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Lock, Calendar, SmilePlus, Edit } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { format, startOfWeek, endOfWeek } from 'date-fns'

const moodEmojis = {
  happy: '😊',
  neutral: '😐',
  sad: '😢',
  anxious: '😰',
  excited: '🎉',
  angry: '😠',
  calm: '😌'
}

export function JournalWidget() {
  const router = useRouter()
  const { entries, encryptionKey } = useJournalStore()
  const [recentEntry, setRecentEntry] = useState<string | null>(null)

  const todayEntry = entries.find((e) => e.entry_date === new Date().toISOString().split('T')[0])
  const weekStart = startOfWeek(new Date())
  const weekEnd = endOfWeek(new Date())
  const weekEntries = entries.filter((e) => {
    const date = new Date(e.entry_date)
    return date >= weekStart && date <= weekEnd
  })

  const moodCounts = weekEntries.reduce(
    (acc, entry) => {
      if (entry.mood) {
        acc[entry.mood] = (acc[entry.mood] || 0) + 1
      }
      return acc
    },
    {} as Record<string, number>
  )

  const dominantMood = Object.entries(moodCounts).reduce(
    (prev, [mood, count]) => (count > (prev.count || 0) ? { mood, count } : prev),
    { mood: '', count: 0 }
  )

  useEffect(() => {
    const loadRecentEntry = async () => {
      const recent = entries[0]
      if (recent && encryptionKey) {
        try {
          const decrypted = await useJournalStore.getState().decryptEntry(recent.id)
          setRecentEntry(decrypted.slice(0, 100) + (decrypted.length > 100 ? '...' : ''))
        } catch (error) {
          setRecentEntry(null)
        }
      }
    }

    loadRecentEntry()
  }, [entries, encryptionKey])

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Lock className="w-5 h-5 text-cyan-500" />
            Journal & Reflection
          </span>
          <Button variant="ghost" size="sm" onClick={() => router.push('/life/journal')}>
            View All →
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">This Week</p>
            <p className="text-2xl font-bold">{weekEntries.length} entries</p>
          </div>
          {dominantMood.mood && (
            <div className="text-center">
              <p className="text-3xl">{moodEmojis[dominantMood.mood as keyof typeof moodEmojis]}</p>
              <p className="text-xs text-muted-foreground mt-1">Dominant mood</p>
            </div>
          )}
        </div>

        {todayEntry ? (
          <div className="p-3 rounded-lg bg-muted">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Today&apos;s Entry
              </span>
              {todayEntry.mood && <span className="text-lg">{moodEmojis[todayEntry.mood]}</span>}
            </div>
            {recentEntry && <p className="text-sm text-muted-foreground">{recentEntry}</p>}
            {todayEntry.tags.length > 0 && (
              <div className="flex gap-1 mt-2">
                {todayEntry.tags.slice(0, 3).map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-4 text-muted-foreground">
            <p className="text-sm">No entry for today yet</p>
            <p className="text-xs mt-1">Take a moment to reflect on your day</p>
          </div>
        )}

        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="flex-1"
            onClick={() => router.push('/life/journal?action=new')}
          >
            <Edit className="w-4 h-4 mr-1" />
            Write Entry
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="flex-1"
            onClick={() => router.push('/life/journal?view=mood')}
          >
            <SmilePlus className="w-4 h-4 mr-1" />
            Mood Trends
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
