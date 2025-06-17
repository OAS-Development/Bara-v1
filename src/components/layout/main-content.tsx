'use client'

export function MainContent({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex-1 flex flex-col">
      {/* Toolbar */}
      <div className="h-12 border-b border-gray-800 flex items-center px-4">
        <button className="text-sm text-gray-400 hover:text-gray-200">
          View Options
        </button>
      </div>
      
      {/* Content Area */}
      <div className="flex-1 overflow-y-auto">
        {children}
      </div>
      
      {/* Quick Entry Bar */}
      <div className="h-14 border-t border-gray-800 flex items-center px-4">
        <input
          type="text"
          placeholder="Type to add to Inbox"
          className="flex-1 bg-gray-800 rounded px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
    </div>
  )
}