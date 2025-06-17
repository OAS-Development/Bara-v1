'use client'

import { X } from 'lucide-react'

export function Inspector() {
  return (
    <div className="h-full flex flex-col bg-gray-950">
      {/* Header */}
      <div className="h-12 border-b border-gray-800 flex items-center justify-between px-4">
        <h2 className="text-sm font-semibold">Inspector</h2>
        <button className="text-gray-400 hover:text-gray-200">
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 p-4">
        <p className="text-sm text-gray-500">Select a task to view details</p>
      </div>
    </div>
  )
}
