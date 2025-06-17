'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { X, Command } from 'lucide-react'
import { fadeIn, scaleIn } from '@/lib/animations'

interface HelpOverlayProps {
  isOpen: boolean
  onClose: () => void
  shortcuts: Array<{
    keys: string[]
    description: string
    context?: string
  }>
}

export function HelpOverlay({ isOpen, onClose, shortcuts }: HelpOverlayProps) {
  const groupedShortcuts = shortcuts.reduce((acc, shortcut) => {
    const category = shortcut.keys[0] === 'g' ? 'Navigation' : 'Actions'
    if (!acc[category]) acc[category] = []
    acc[category].push(shortcut)
    return acc
  }, {} as Record<string, typeof shortcuts>)

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
          />
          
          <motion.div
            variants={scaleIn}
            initial="initial"
            animate="animate"
            exit="exit"
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="bg-gray-900 border border-gray-800 rounded-lg shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden">
              <div className="flex items-center justify-between p-6 border-b border-gray-800">
                <div className="flex items-center gap-3">
                  <Command className="h-5 w-5 text-blue-500" />
                  <h2 className="text-xl font-semibold">Keyboard Shortcuts</h2>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              
              <div className="p-6 overflow-y-auto">
                {Object.entries(groupedShortcuts).map(([category, categoryShortcuts]) => (
                  <div key={category} className="mb-8">
                    <h3 className="text-sm font-semibold text-gray-400 uppercase mb-4">
                      {category}
                    </h3>
                    <div className="space-y-3">
                      {categoryShortcuts.map((shortcut, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-3 rounded-lg bg-gray-800/50"
                        >
                          <span className="text-sm">{shortcut.description}</span>
                          <div className="flex items-center gap-1">
                            {shortcut.keys.map((key, keyIndex) => (
                              <span key={keyIndex} className="flex items-center gap-1">
                                <kbd className="px-2 py-1 text-xs font-mono bg-gray-700 border border-gray-600 rounded">
                                  {key === 'Meta' ? '⌘' : key}
                                </kbd>
                                {keyIndex < shortcut.keys.length - 1 && (
                                  <span className="text-gray-500 text-xs">then</span>
                                )}
                              </span>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
                
                <div className="mt-8 p-4 bg-blue-900/20 border border-blue-800/50 rounded-lg">
                  <p className="text-sm text-blue-400">
                    <strong>Pro tip:</strong> Press <kbd className="px-1 py-0.5 text-xs font-mono bg-gray-700 border border-gray-600 rounded">?</kbd> anytime to show this help
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}