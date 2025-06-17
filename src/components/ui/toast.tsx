'use client'

import { Toaster as HotToaster } from 'react-hot-toast'

export function Toaster() {
  return (
    <HotToaster
      position="bottom-right"
      toastOptions={{
        className: '',
        duration: 4000,
        style: {
          background: '#1f2937',
          color: '#f3f4f6',
          border: '1px solid #374151',
          padding: '12px 16px',
          borderRadius: '0.5rem',
          fontSize: '14px',
          maxWidth: '400px',
        },
        success: {
          iconTheme: {
            primary: '#10b981',
            secondary: '#1f2937',
          },
          style: {
            border: '1px solid #059669',
          },
        },
        error: {
          iconTheme: {
            primary: '#ef4444',
            secondary: '#1f2937',
          },
          style: {
            border: '1px solid #dc2626',
          },
        },
      }}
    />
  )
}