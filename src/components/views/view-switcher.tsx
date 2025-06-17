'use client'

import { usePathname, useRouter } from 'next/navigation'
import { Home, Calendar, Clock, Archive, Flag, Filter } from 'lucide-react'
import { cn } from '@/lib/utils'

const views = [
  { name: 'Inbox', href: '/inbox', icon: Home, shortcut: '1' },
  { name: 'Today', href: '/today', icon: Calendar, shortcut: '2' },
  { name: 'Upcoming', href: '/upcoming', icon: Clock, shortcut: '3' },
  { name: 'Anytime', href: '/anytime', icon: Archive, shortcut: '4' },
  { name: 'Someday', href: '/someday', icon: Flag, shortcut: '5' },
]

export function ViewSwitcher() {
  const pathname = usePathname()
  const router = useRouter()

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.metaKey || e.ctrlKey) {
      const view = views.find(v => v.shortcut === e.key)
      if (view) {
        e.preventDefault()
        router.push(view.href)
      }
    }
  }

  // Set up keyboard shortcuts
  if (typeof window !== 'undefined') {
    window.addEventListener('keydown', handleKeyDown)
  }

  return (
    <div className="flex items-center gap-1 p-2 bg-gray-900 rounded-lg">
      {views.map((view) => {
        const Icon = view.icon
        const isActive = pathname === view.href
        
        return (
          <button
            key={view.href}
            onClick={() => router.push(view.href)}
            className={cn(
              "flex items-center gap-2 px-3 py-1.5 rounded-md text-sm transition-colors",
              isActive 
                ? "bg-blue-600 text-white" 
                : "text-gray-400 hover:text-gray-200 hover:bg-gray-800"
            )}
            title={`${view.name} (⌘${view.shortcut})`}
          >
            <Icon className="h-4 w-4" />
            <span className="hidden sm:inline">{view.name}</span>
          </button>
        )
      })}
      
      <div className="mx-2 h-4 w-px bg-gray-700" />
      
      <button
        className="flex items-center gap-2 px-3 py-1.5 rounded-md text-sm text-gray-400 hover:text-gray-200 hover:bg-gray-800 transition-colors"
        title="Custom Perspectives"
      >
        <Filter className="h-4 w-4" />
        <span className="hidden sm:inline">Custom</span>
      </button>
    </div>
  )
}