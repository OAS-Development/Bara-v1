'use client'

import { useState, useRef, useEffect } from 'react'
import { useTaskStore } from '@/stores/task-store'

export function MainContent({ children }: { children: React.ReactNode }) {
  const [quickEntryValue, setQuickEntryValue] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)
  const { createTask } = useTaskStore()

  const handleQuickEntry = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!quickEntryValue.trim()) return
    
    await createTask({ title: quickEntryValue.trim() })
    setQuickEntryValue('')
  }

  // Focus quick entry on mount
  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  return (
    <div className="flex-1 flex flex-col">
      {/* Toolbar */}
      <div className="h-12 border-b border-gray-800 flex items-center px-4">
        <button className="text-sm text-gray-400 hover:text-gray-200">
          View Options
        </button>
      </div>
      
      {/* Content Area */}
      <div className="flex-1 overflow-y-auto">
        {children}
      </div>
      
      {/* Quick Entry Bar */}
      <form onSubmit={handleQuickEntry} className="h-14 border-t border-gray-800 flex items-center px-4">
        <input
          ref={inputRef}
          type="text"
          value={quickEntryValue}
          onChange={(e) => setQuickEntryValue(e.target.value)}
          placeholder="Type to add to Inbox"
          className="flex-1 bg-gray-800 rounded px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </form>
    </div>
  )
}