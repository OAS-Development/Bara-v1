'use client'

import { useEffect, useCallback, useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { useTaskStore } from '@/stores/task-store'
import { toast } from 'sonner'

interface Shortcut {
  keys: string[]
  description: string
  handler: () => void
  context?: string
}

export function useShortcuts() {
  const router = useRouter()
  const [showHelp, setShowHelp] = useState(false)
  const { selectTask } = useTaskStore()

  const shortcuts: Shortcut[] = useMemo(
    () => [
      // Navigation
      { keys: ['g', 'i'], description: 'Go to Inbox', handler: () => router.push('/inbox') },
      { keys: ['g', 't'], description: 'Go to Today', handler: () => router.push('/today') },
      { keys: ['g', 'u'], description: 'Go to Upcoming', handler: () => router.push('/upcoming') },
      { keys: ['g', 'p'], description: 'Go to Projects', handler: () => router.push('/projects') },
      { keys: ['g', 'r'], description: 'Go to Review', handler: () => router.push('/review') },
      {
        keys: ['g', 'l'],
        description: 'Go to Life Dashboard',
        handler: () => router.push('/life')
      },

      // Actions
      {
        keys: ['a'],
        description: 'Quick add task',
        handler: () => {
          const event = new KeyboardEvent('keydown', { key: 'n', metaKey: true })
          window.dispatchEvent(event)
        }
      },
      {
        keys: ['d'],
        description: 'Mark done/undone',
        handler: () => {
          const selectedId = useTaskStore.getState().selectedTaskId
          if (selectedId) {
            useTaskStore.getState().toggleTask(selectedId)
            toast.success('Task toggled')
          }
        }
      },
      {
        keys: ['/'],
        description: 'Focus search',
        handler: () => {
          const searchInput = document.querySelector('input[type="search"]') as HTMLInputElement
          searchInput?.focus()
        }
      },
      { keys: ['?'], description: 'Show help', handler: () => setShowHelp(true) },
      {
        keys: ['Escape'],
        description: 'Close modals/Clear selection',
        handler: () => {
          setShowHelp(false)
          selectTask(null)
          // Trigger escape on all open modals
          const escEvent = new KeyboardEvent('keydown', { key: 'Escape' })
          window.dispatchEvent(escEvent)
        }
      }
    ],
    [router, selectTask]
  )

  const handleKeyPress = useCallback(
    (event: KeyboardEvent) => {
      // Don't trigger shortcuts when typing in inputs
      if (
        event.target instanceof HTMLInputElement ||
        event.target instanceof HTMLTextAreaElement ||
        event.target instanceof HTMLSelectElement
      ) {
        return
      }

      const key = event.key.toLowerCase()

      // Check single key shortcuts
      const singleKeyShortcut = shortcuts.find((s) => s.keys.length === 1 && s.keys[0] === key)

      if (singleKeyShortcut) {
        event.preventDefault()
        singleKeyShortcut.handler()
        return
      }

      // Handle 'g' prefix shortcuts
      if (key === 'g') {
        event.preventDefault()
        const handleGPrefix = (e: KeyboardEvent) => {
          const nextKey = e.key.toLowerCase()
          const gShortcut = shortcuts.find(
            (s) => s.keys.length === 2 && s.keys[0] === 'g' && s.keys[1] === nextKey
          )
          if (gShortcut) {
            e.preventDefault()
            gShortcut.handler()
          }
          window.removeEventListener('keydown', handleGPrefix)
        }
        window.addEventListener('keydown', handleGPrefix)

        // Remove listener after 2 seconds if no follow-up key
        setTimeout(() => {
          window.removeEventListener('keydown', handleGPrefix)
        }, 2000)
      }
    },
    [shortcuts]
  )

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [handleKeyPress])

  return { shortcuts, showHelp, setShowHelp }
}
