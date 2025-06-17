'use client'

import { useState, useEffect } from 'react'
import { X, Plus, Check } from 'lucide-react'
import { useTagStore } from '@/stores/tag-store'
import { TagChip } from './tag-chip'
import { cn } from '@/lib/utils'

interface TagPickerProps {
  selectedTagIds: string[]
  onTagsChange: (tagIds: string[]) => void
  onClose: () => void
}

export function TagPicker({ selectedTagIds, onTagsChange, onClose }: TagPickerProps) {
  const { tags, fetchTags } = useTagStore()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set(selectedTagIds))

  useEffect(() => {
    fetchTags()
  }, [fetchTags])

  const filteredTags = tags.filter((tag) =>
    tag.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const toggleTag = (tagId: string) => {
    const newSelected = new Set(selectedIds)
    if (newSelected.has(tagId)) {
      newSelected.delete(tagId)
    } else {
      newSelected.add(tagId)
    }
    setSelectedIds(newSelected)
  }

  const handleSave = () => {
    onTagsChange(Array.from(selectedIds))
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-md">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold">Select Tags</h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded">
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="p-4">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search tags..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            autoFocus
          />
        </div>

        <div className="max-h-64 overflow-y-auto px-4">
          {filteredTags.length === 0 ? (
            <p className="text-sm text-gray-500 text-center py-4">No tags found</p>
          ) : (
            <div className="space-y-1">
              {filteredTags.map((tag) => (
                <button
                  key={tag.id}
                  onClick={() => toggleTag(tag.id)}
                  className={cn(
                    'w-full flex items-center justify-between p-2 rounded hover:bg-gray-50',
                    selectedIds.has(tag.id) && 'bg-blue-50'
                  )}
                >
                  <TagChip name={tag.name} color={tag.color} icon={tag.icon} size="md" />
                  {selectedIds.has(tag.id) && <Check className="h-4 w-4 text-blue-600" />}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="flex gap-3 p-4 border-t">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex-1 px-4 py-2 text-white bg-blue-500 hover:bg-blue-600 rounded-md transition-colors"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  )
}
