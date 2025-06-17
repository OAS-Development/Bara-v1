'use client'

import { useState } from 'react'
import { Filter, X } from 'lucide-react'
import { useTagStore } from '@/stores/tag-store'
import { TagChip } from './tag-chip'
import { cn } from '@/lib/utils'

interface TagFilterProps {
  selectedTagIds: string[]
  onFilterChange: (tagIds: string[]) => void
}

export function TagFilter({ selectedTagIds, onFilterChange }: TagFilterProps) {
  const { tags } = useTagStore()
  const [isOpen, setIsOpen] = useState(false)

  const selectedTags = tags.filter((tag) => selectedTagIds.includes(tag.id))

  const toggleTag = (tagId: string) => {
    if (selectedTagIds.includes(tagId)) {
      onFilterChange(selectedTagIds.filter((id) => id !== tagId))
    } else {
      onFilterChange([...selectedTagIds, tagId])
    }
  }

  const clearFilters = () => {
    onFilterChange([])
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'flex items-center gap-2 px-3 py-1.5 text-sm rounded-md transition-colors',
          selectedTagIds.length > 0
            ? 'bg-blue-100 text-blue-700 hover:bg-blue-200'
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
        )}
      >
        <Filter className="h-4 w-4" />
        <span>
          {selectedTagIds.length > 0
            ? `${selectedTagIds.length} tag${selectedTagIds.length > 1 ? 's' : ''}`
            : 'Filter by tags'}
        </span>
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute top-full mt-2 right-0 w-64 bg-white rounded-lg shadow-lg border z-50">
            <div className="p-3 border-b">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium">Filter by Tags</h3>
                {selectedTagIds.length > 0 && (
                  <button
                    onClick={clearFilters}
                    className="text-xs text-gray-500 hover:text-gray-700"
                  >
                    Clear all
                  </button>
                )}
              </div>
            </div>

            <div className="max-h-64 overflow-y-auto p-2">
              {tags.length === 0 ? (
                <p className="text-sm text-gray-500 text-center py-4">No tags available</p>
              ) : (
                <div className="space-y-1">
                  {tags.map((tag) => (
                    <button
                      key={tag.id}
                      onClick={() => toggleTag(tag.id)}
                      className={cn(
                        'w-full flex items-center justify-between p-2 rounded hover:bg-gray-50',
                        selectedTagIds.includes(tag.id) && 'bg-blue-50'
                      )}
                    >
                      <TagChip name={tag.name} color={tag.color} icon={tag.icon} />
                      {selectedTagIds.includes(tag.id) && <X className="h-3 w-3 text-blue-600" />}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </>
      )}

      {selectedTags.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-2">
          {selectedTags.map((tag) => (
            <TagChip
              key={tag.id}
              name={tag.name}
              color={tag.color}
              icon={tag.icon}
              onRemove={() => toggleTag(tag.id)}
            />
          ))}
        </div>
      )}
    </div>
  )
}
