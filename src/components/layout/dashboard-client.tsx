'use client'

import { useState } from 'react'
import { MobileSidebar } from '@/components/layout/mobile-sidebar'
import { MainContent } from '@/components/layout/main-content'
import { Inspector } from '@/components/layout/inspector'
import { QuickEntryModal } from '@/components/tasks/quick-entry-modal'
import { CommandPalette } from '@/components/command-palette'
import { useKeyboard } from '@/hooks/use-keyboard'
import { useShortcuts } from '@/hooks/use-shortcuts'
import { HelpOverlay } from '@/components/shortcuts/help-overlay'
import { motion } from 'framer-motion'
import { pageTransition } from '@/lib/animations'

export function DashboardClient({ children }: { children: React.ReactNode }) {
  const [quickEntryOpen, setQuickEntryOpen] = useState(false)
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false)
  const [inspectorOpen, setInspectorOpen] = useState(true)
  const { shortcuts, showHelp, setShowHelp } = useShortcuts()

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
    },
    {
      key: 'i',
      meta: true,
      handler: () => setInspectorOpen(!inspectorOpen)
    }
  ])

  return (
    <>
      <div className="flex h-screen bg-gray-900 text-gray-100">
        {/* Mobile Sidebar Button & Desktop Sidebar */}
        <MobileSidebar />
        
        {/* Main Content - Flexible */}
        <motion.main 
          className="flex-1 flex flex-col min-w-0 lg:pl-0 pl-14"
          initial="initial"
          animate="animate"
          exit="exit"
          variants={pageTransition}
        >
          <MainContent>{children}</MainContent>
        </motion.main>
        
        {/* Inspector - 320px, collapsible */}
        {inspectorOpen && (
          <motion.aside 
            className="hidden xl:block w-80 border-l border-gray-800 flex-shrink-0"
            initial={{ x: 320 }}
            animate={{ x: 0 }}
            exit={{ x: 320 }}
            transition={{ type: 'spring', damping: 25 }}
          >
            <Inspector />
          </motion.aside>
        )}
      </div>
      
      <QuickEntryModal 
        isOpen={quickEntryOpen}
        onClose={() => setQuickEntryOpen(false)}
      />
      
      <CommandPalette
        isOpen={commandPaletteOpen}
        onClose={() => setCommandPaletteOpen(false)}
      />
      
      <HelpOverlay
        isOpen={showHelp}
        onClose={() => setShowHelp(false)}
        shortcuts={shortcuts}
      />
    </>
  )
}