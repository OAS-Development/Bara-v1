'use client'

import { useState } from 'react'
import { ProjectList } from './project-list'
import { Database } from '@/types/database.types'
import { X, Plus } from 'lucide-react'
import { ProjectForm } from './project-form'

type Project = Database['public']['Tables']['projects']['Row']

interface ProjectPickerProps {
  selectedProjectId?: string
  onSelectProject: (projectId: string | null) => void
  onClose: () => void
}

export function ProjectPicker({ selectedProjectId, onSelectProject, onClose }: ProjectPickerProps) {
  const [showNewProject, setShowNewProject] = useState(false)

  const handleSelectProject = (project: Project) => {
    onSelectProject(project.id)
    onClose()
  }

  const handleClearProject = () => {
    onSelectProject(null)
    onClose()
  }

  if (showNewProject) {
    return <ProjectForm onClose={() => setShowNewProject(false)} onSuccess={() => setShowNewProject(false)} />
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-md max-h-[60vh] flex flex-col">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold">Select Project</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          <div className="p-2">
            <button
              onClick={handleClearProject}
              className="w-full text-left px-3 py-2 hover:bg-gray-50 rounded text-sm text-gray-600"
            >
              No Project (Inbox)
            </button>
          </div>
          
          <div className="border-t">
            <ProjectList
              onSelectProject={handleSelectProject}
              selectedProjectId={selectedProjectId}
            />
          </div>
        </div>

        <div className="border-t p-4">
          <button
            onClick={() => setShowNewProject(true)}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
          >
            <Plus className="h-4 w-4" />
            New Project
          </button>
        </div>
      </div>
    </div>
  )
}