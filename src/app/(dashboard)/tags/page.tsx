'use client'

import { useEffect } from 'react'
import { useTagStore } from '@/stores/tag-store'
import { TagManager } from '@/components/tags/tag-manager'
import { Loader2 } from 'lucide-react'

export default function TagsPage() {
  const { loading, error, fetchTags } = useTagStore()

  useEffect(() => {
    fetchTags()
  }, [fetchTags])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <p className="text-red-500 mb-2">Error loading tags</p>
          <p className="text-sm text-gray-500">{error.message}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-full">
      <div className="flex-1 flex flex-col">
        <div className="border-b px-6 py-4">
          <h1 className="text-2xl font-semibold">Tags</h1>
          <p className="text-sm text-gray-500 mt-1">Organize your tasks with tags and contexts</p>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <TagManager />
        </div>
      </div>
    </div>
  )
}
