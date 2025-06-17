'use client'

import { useState, useRef, useEffect } from 'react'
import { X } from 'lucide-react'
import { useTaskStore } from '@/stores/task-store'

interface QuickEntryModalProps {
  isOpen: boolean
  onClose: () => void
}

export function QuickEntryModal({ isOpen, onClose }: QuickEntryModalProps) {
  const [title, setTitle] = useState('')
  const [note, setNote] = useState('')
  const titleRef = useRef<HTMLInputElement>(null)
  const { createTask } = useTaskStore()

  useEffect(() => {
    if (isOpen) {
      titleRef.current?.focus()
      setTitle('')
      setNote('')
    }
  }, [isOpen])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return
    
    await createTask({ title: title.trim(), note: note.trim() })
    onClose()
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose()
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div 
        className="bg-gray-900 rounded-lg w-full max-w-lg mx-4"
        onKeyDown={handleKeyDown}
      >
        <form onSubmit={handleSubmit}>
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-800">
            <h2 className="text-sm font-semibold">New Task</h2>
            <button
              type="button"
              onClick={onClose}
              className="text-gray-400 hover:text-gray-200"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          
          <div className="p-4 space-y-4">
            <input
              ref={titleRef}
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Task title"
              className="w-full bg-gray-800 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Notes (optional)"
              rows={3}
              className="w-full bg-gray-800 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
          </div>
          
          <div className="flex justify-end gap-2 px-4 py-3 border-t border-gray-800">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 text-sm text-gray-400 hover:text-gray-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Add Task
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}