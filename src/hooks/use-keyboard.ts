import { useEffect } from 'react'

type KeyboardHandler = (event: KeyboardEvent) => void

interface KeyboardShortcut {
  key: string
  meta?: boolean
  ctrl?: boolean
  shift?: boolean
  handler: KeyboardHandler
}

export function useKeyboard(shortcuts: KeyboardShortcut[]) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      shortcuts.forEach(shortcut => {
        const metaMatch = shortcut.meta ? event.metaKey || event.ctrlKey : true
        const ctrlMatch = shortcut.ctrl ? event.ctrlKey : true
        const shiftMatch = shortcut.shift ? event.shiftKey : true
        const keyMatch = event.key.toLowerCase() === shortcut.key.toLowerCase()
        
        if (metaMatch && ctrlMatch && shiftMatch && keyMatch) {
          event.preventDefault()
          shortcut.handler(event)
        }
      })
    }
    
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [shortcuts])
}