'use client'

import { useEffect } from 'react'
import toast from 'react-hot-toast'

export function ServiceWorkerRegistration() {
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js').then(
          (registration) => {
            console.log('ServiceWorker registration successful')
            
            // Handle updates
            registration.addEventListener('updatefound', () => {
              const newWorker = registration.installing
              if (newWorker) {
                newWorker.addEventListener('statechange', () => {
                  if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                    toast('New version available! Refresh to update.', {
                      duration: 10000,
                      icon: '🔄'
                    })
                  }
                })
              }
            })
          },
          (err) => {
            console.log('ServiceWorker registration failed: ', err)
          }
        )
      })
    }

    // iOS PWA detection
    if ('standalone' in navigator && (navigator as any).standalone) {
      document.documentElement.classList.add('ios-pwa')
    }
  }, [])

  return null
}