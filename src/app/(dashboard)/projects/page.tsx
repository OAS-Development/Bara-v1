'use client'

import { useState } from 'react'
import { ProjectList } from '@/components/projects/project-list'
import { ProjectForm } from '@/components/projects/project-form'
import { useProjectStore } from '@/stores/project-store'
import { Plus, FolderPlus } from 'lucide-react'
import { Database } from '@/types/database.types'

type Project = Database['public']['Tables']['projects']['Row']

export default function ProjectsPage() {
  const [showNewProject, setShowNewProject] = useState(false)
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [parentProjectId, setParentProjectId] = useState<string | undefined>()
  const { updateProject } = useProjectStore()

  const handleSelectProject = (project: Project) => {
    setSelectedProject(project)
  }

  const handleNewProject = (parentId?: string) => {
    setParentProjectId(parentId)
    setShowNewProject(true)
  }

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.metaKey && e.key === 'n') {
      e.preventDefault()
      handleNewProject(selectedProject?.id)
    }
  }

  return (
    <div className="flex h-full">
      <div className="flex-1 flex flex-col">
        <div className="border-b px-6 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-semibold">Projects</h1>
            <div className="flex gap-2">
              {selectedProject && (
                <button
                  onClick={() => handleNewProject(selectedProject.id)}
                  className="flex items-center gap-2 px-3 py-1.5 text-sm bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
                >
                  <FolderPlus className="h-4 w-4" />
                  Add Subproject
                </button>
              )}
              <button
                onClick={() => handleNewProject()}
                className="flex items-center gap-2 px-3 py-1.5 text-sm bg-blue-500 text-white hover:bg-blue-600 rounded-md transition-colors"
              >
                <Plus className="h-4 w-4" />
                New Project
              </button>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          <ProjectList
            onSelectProject={handleSelectProject}
            selectedProjectId={selectedProject?.id}
          />
        </div>
      </div>

      {selectedProject && (
        <div className="w-80 border-l bg-gray-50 p-6">
          <h2 className="text-lg font-semibold mb-4">{selectedProject.name}</h2>
          
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-600">Type</label>
              <select
                value={selectedProject.type || 'parallel'}
                onChange={(e) => updateProject(selectedProject.id, { type: e.target.value as any })}
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="parallel">Parallel</option>
                <option value="sequential">Sequential</option>
                <option value="single-actions">Single Actions</option>
              </select>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-600">Status</label>
              <select
                value={selectedProject.status}
                onChange={(e) => updateProject(selectedProject.id, { status: e.target.value as any })}
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="active">Active</option>
                <option value="on-hold">On Hold</option>
                <option value="completed">Completed</option>
                <option value="dropped">Dropped</option>
              </select>
            </div>

            {selectedProject.note && (
              <div>
                <label className="text-sm font-medium text-gray-600">Notes</label>
                <p className="mt-1 text-sm text-gray-700">{selectedProject.note}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {showNewProject && (
        <ProjectForm
          parentProjectId={parentProjectId}
          onClose={() => {
            setShowNewProject(false)
            setParentProjectId(undefined)
          }}
        />
      )}
    </div>
  )
}