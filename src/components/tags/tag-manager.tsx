'use client'

import { useState } from 'react'
import { Plus, Edit2, Trash2, X } from 'lucide-react'
import { useTagStore } from '@/stores/tag-store'
import { TagChip } from './tag-chip'
import { Database } from '@/types/database.types'

type Tag = Database['public']['Tables']['tags']['Row']
type TagInsert = Database['public']['Tables']['tags']['Insert']

interface TagFormProps {
  tag?: Tag
  onClose: () => void
  onSuccess?: () => void
}

function TagForm({ tag, onClose, onSuccess }: TagFormProps) {
  const { createTag, updateTag } = useTagStore()
  const [formData, setFormData] = useState({
    name: tag?.name || '',
    color: tag?.color || '#3B82F6',
    icon: tag?.icon || ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name.trim()) return

    setIsSubmitting(true)
    if (tag) {
      await updateTag(tag.id, formData)
    } else {
      await createTag(formData as TagInsert)
    }
    setIsSubmitting(false)
    onSuccess?.()
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">{tag ? 'Edit Tag' : 'New Tag'}</h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded">
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tag Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter tag name"
                autoFocus
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Color</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={formData.color}
                  onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                  className="h-10 w-20"
                />
                <input
                  type="text"
                  value={formData.color}
                  onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="#3B82F6"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Icon (Emoji)</label>
              <input
                type="text"
                value={formData.icon}
                onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Optional emoji icon"
              />
            </div>

            <div className="pt-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Preview</label>
              <div className="flex justify-center p-4 bg-gray-50 rounded">
                <TagChip
                  name={formData.name || 'Tag Name'}
                  color={formData.color}
                  icon={formData.icon || null}
                  size="md"
                />
              </div>
            </div>
          </div>

          <div className="flex gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !formData.name.trim()}
              className="flex-1 px-4 py-2 text-white bg-blue-500 hover:bg-blue-600 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Saving...' : tag ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export function TagManager() {
  const { tags, deleteTag } = useTagStore()
  const [showForm, setShowForm] = useState(false)
  const [editingTag, setEditingTag] = useState<Tag | undefined>()

  const handleEdit = (tag: Tag) => {
    setEditingTag(tag)
    setShowForm(true)
  }

  const handleDelete = async (tag: Tag) => {
    if (confirm(`Delete tag "${tag.name}"?`)) {
      await deleteTag(tag.id)
    }
  }

  const handleCloseForm = () => {
    setShowForm(false)
    setEditingTag(undefined)
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Tags</h2>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-3 py-1.5 text-sm bg-blue-500 text-white hover:bg-blue-600 rounded-md transition-colors"
        >
          <Plus className="h-4 w-4" />
          New Tag
        </button>
      </div>

      {tags.length === 0 ? (
        <p className="text-sm text-gray-500 text-center py-8">
          No tags yet. Create your first tag to get started.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {tags.map((tag) => (
            <div
              key={tag.id}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
            >
              <TagChip name={tag.name} color={tag.color} icon={tag.icon} size="md" />
              <div className="flex items-center gap-1">
                <button onClick={() => handleEdit(tag)} className="p-1 hover:bg-gray-200 rounded">
                  <Edit2 className="h-4 w-4 text-gray-500" />
                </button>
                <button onClick={() => handleDelete(tag)} className="p-1 hover:bg-gray-200 rounded">
                  <Trash2 className="h-4 w-4 text-gray-500" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {(showForm || editingTag) && <TagForm tag={editingTag} onClose={handleCloseForm} />}
    </div>
  )
}
