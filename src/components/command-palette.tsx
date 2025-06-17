'use client'

import { useState, useEffect } from 'react'
import { Search } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface CommandPaletteProps {
  isOpen: boolean
  onClose: () => void
}

const commands = [
  { id: 'inbox', title: 'Go to Inbox', action: '/inbox' },
  { id: 'today', title: 'Go to Today', action: '/today' },
  { id: 'projects', title: 'Go to Projects', action: '/projects' },
  { id: 'tags', title: 'Go to Tags', action: '/tags' }
]

export function CommandPalette({ isOpen, onClose }: CommandPaletteProps) {
  const [search, setSearch] = useState('')
  const router = useRouter()

  const filteredCommands = commands.filter((cmd) =>
    cmd.title.toLowerCase().includes(search.toLowerCase())
  )

  useEffect(() => {
    if (isOpen) {
      setSearch('')
    }
  }, [isOpen])

  const handleSelect = (action: string) => {
    router.push(action)
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-start justify-center pt-32 z-50">
      <div className="bg-gray-900 rounded-lg w-full max-w-lg mx-4">
        <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-800">
          <Search className="w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Type a command..."
            className="flex-1 bg-transparent text-sm focus:outline-none"
            autoFocus
          />
        </div>

        <div className="max-h-96 overflow-y-auto">
          {filteredCommands.map((cmd) => (
            <button
              key={cmd.id}
              onClick={() => handleSelect(cmd.action)}
              className="w-full px-4 py-3 text-left text-sm hover:bg-gray-800"
            >
              {cmd.title}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
