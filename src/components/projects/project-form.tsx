'use client'

import { useState } from 'react'
import { useProjectStore } from '@/stores/project-store'
import { Database } from '@/types/database.types'
import { X } from 'lucide-react'

type ProjectInsert = Database['public']['Tables']['projects']['Insert']
type ProjectType = Database['public']['Enums']['project_type']

interface ProjectFormProps {
  parentProjectId?: string
  onClose: () => void
  onSuccess?: () => void
}

export function ProjectForm({ parentProjectId, onClose, onSuccess }: ProjectFormProps) {
  const { createProject, projects } = useProjectStore()
  const [formData, setFormData] = useState<Partial<ProjectInsert>>({
    name: '',
    type: 'parallel' as ProjectType,
    status: 'active',
    parent_id: parentProjectId,
    description: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name?.trim()) return

    setIsSubmitting(true)
    const project = await createProject(formData as ProjectInsert)
    setIsSubmitting(false)

    if (project) {
      onSuccess?.()
      onClose()
    }
  }

  const parentProject = parentProjectId ? projects.find((p) => p.id === parentProjectId) : null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">
            {parentProject ? `New Project in "${parentProject.name}"` : 'New Project'}
          </h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded">
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Project Name</label>
              <input
                type="text"
                value={formData.name || ''}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter project name"
                autoFocus
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Project Type</label>
              <select
                value={formData.type || 'parallel'}
                onChange={(e) => setFormData({ ...formData, type: e.target.value as ProjectType })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="parallel">Parallel (⇉) - Tasks can be done in any order</option>
                <option value="sequential">Sequential (→) - Tasks must be done in order</option>
                <option value="single-actions">Single Actions (•) - List of unrelated tasks</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                value={formData.description || ''}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={3}
                placeholder="Optional description for this project"
              />
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
              disabled={isSubmitting || !formData.name?.trim()}
              className="flex-1 px-4 py-2 text-white bg-blue-500 hover:bg-blue-600 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Creating...' : 'Create Project'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
