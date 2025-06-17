'use client'

import { useEffect } from 'react'
import { useProjectStore } from '@/stores/project-store'
import { ProjectItem } from './project-item'
import { Database } from '@/types/database.types'
import { Loader2 } from 'lucide-react'

type Project = Database['public']['Tables']['projects']['Row']

interface ProjectListProps {
  onSelectProject?: (project: Project) => void
  selectedProjectId?: string
}

export function ProjectList({ onSelectProject, selectedProjectId }: ProjectListProps) {
  const { projectsTree, loading, error, fetchProjects } = useProjectStore()

  useEffect(() => {
    fetchProjects()
  }, [fetchProjects])

  if (loading) {
    return (
      <div className="flex items-center justify-center p-4">
        <Loader2 className="h-5 w-5 animate-spin text-gray-400" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-4 text-sm text-red-500">
        Error: {error}
      </div>
    )
  }

  if (projectsTree.length === 0) {
    return (
      <div className="p-4 text-sm text-gray-500 text-center">
        No projects yet. Create your first project to get started.
      </div>
    )
  }

  return (
    <div className="py-2">
      {projectsTree.map(project => (
        <ProjectItem
          key={project.id}
          project={project}
          onSelect={onSelectProject}
          selectedId={selectedProjectId}
        />
      ))}
    </div>
  )
}