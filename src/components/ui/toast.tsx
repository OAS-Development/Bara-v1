'use client'

import { Toaster as Sonner, toast as sonnerToast } from 'sonner'

export function Toaster() {
  return (
    <Sonner
      position="bottom-right"
      toastOptions={{
        unstyled: false,
        classNames: {
          toast: 'bg-gray-800 border border-gray-700 text-gray-100',
          title: 'text-gray-100',
          description: 'text-gray-400',
          actionButton: 'bg-blue-600 text-white',
          cancelButton: 'bg-gray-700 text-gray-100',
          closeButton: 'bg-gray-800 text-gray-400 hover:text-gray-100'
        }
      }}
      richColors
      closeButton
    />
  )
}

export const toast = sonnerToast