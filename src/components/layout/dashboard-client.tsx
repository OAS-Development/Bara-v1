'use client'

import { useState } from 'react'
import { Sidebar } from '@/components/layout/sidebar'
import { MainContent } from '@/components/layout/main-content'
import { Inspector } from '@/components/layout/inspector'
import { QuickEntryModal } from '@/components/tasks/quick-entry-modal'
import { CommandPalette } from '@/components/command-palette'
import { useKeyboard } from '@/hooks/use-keyboard'

export function DashboardClient({ children }: { children: React.ReactNode }) {
  const [quickEntryOpen, setQuickEntryOpen] = useState(false)
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false)

  useKeyboard([
    {
      key: 'n',
      meta: true,
      handler: () => setQuickEntryOpen(true)
    },
    {
      key: 'k',
      meta: true,
      handler: () => setCommandPaletteOpen(true)
    }
  ])

  return (
    <>
      <div className="flex h-screen bg-gray-900 text-gray-100">
        {/* Sidebar - 240px */}
        <aside className="w-60 border-r border-gray-800 flex-shrink-0">
          <Sidebar />
        </aside>
        
        {/* Main Content - Flexible */}
        <main className="flex-1 flex flex-col min-w-0">
          <MainContent>{children}</MainContent>
        </main>
        
        {/* Inspector - 320px, collapsible */}
        <aside className="w-80 border-l border-gray-800 flex-shrink-0">
          <Inspector />
        </aside>
      </div>
      
      <QuickEntryModal 
        isOpen={quickEntryOpen}
        onClose={() => setQuickEntryOpen(false)}
      />
      
      <CommandPalette
        isOpen={commandPaletteOpen}
        onClose={() => setCommandPaletteOpen(false)}
      />
    </>
  )
}