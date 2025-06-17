'use client'

import { useState } from 'react'
import {
  ChevronRight,
  ChevronDown,
  Folder,
  FolderOpen,
  Archive,
  CheckCircle,
  Circle,
  MoreVertical
} from 'lucide-react'
import { Database } from '@/types/database.types'
import { useProjectStore } from '@/stores/project-store'
import { cn } from '@/lib/utils'

type Project = Database['public']['Tables']['projects']['Row']

interface ProjectWithChildren extends Project {
  children?: ProjectWithChildren[]
  taskCount?: number
}

interface ProjectItemProps {
  project: ProjectWithChildren
  level?: number
  onSelect?: (project: Project) => void
  selectedId?: string
}

export function ProjectItem({ project, level = 0, onSelect, selectedId }: ProjectItemProps) {
  const [isExpanded, setIsExpanded] = useState(true)
  const { updateProject, deleteProject } = useProjectStore()
  const hasChildren = project.children && project.children.length > 0

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsExpanded(!isExpanded)
  }

  const handleSelect = () => {
    onSelect?.(project)
  }

  const handleStatusToggle = async (e: React.MouseEvent) => {
    e.stopPropagation()
    const newStatus = project.status === 'active' ? 'completed' : 'active'
    await updateProject(project.id, { status: newStatus })
  }

  const getProjectIcon = () => {
    if (project.status === 'completed') return <Archive className="h-4 w-4 text-gray-400" />
    if (project.status === 'dropped') return <Circle className="h-4 w-4 text-gray-300" />
    if (project.status === 'active' && hasChildren)
      return isExpanded ? (
        <FolderOpen className="h-4 w-4 text-blue-500" />
      ) : (
        <Folder className="h-4 w-4 text-blue-500" />
      )
    return <Folder className="h-4 w-4 text-blue-500" />
  }

  const getProjectTypeIndicator = () => {
    if (!project.type) return null
    const types = {
      sequential: '→',
      parallel: '⇉',
      'single-actions': '•'
    }
    return (
      <span className="text-xs text-gray-400 ml-1">
        {types[project.type as keyof typeof types]}
      </span>
    )
  }

  return (
    <>
      <div
        className={cn(
          'group flex items-center gap-1 px-2 py-1.5 hover:bg-gray-50 cursor-pointer rounded',
          selectedId === project.id && 'bg-blue-50 hover:bg-blue-50'
        )}
        style={{ paddingLeft: `${level * 20 + 8}px` }}
        onClick={handleSelect}
      >
        {hasChildren ? (
          <button onClick={handleToggle} className="p-0.5 hover:bg-gray-200 rounded">
            {isExpanded ? (
              <ChevronDown className="h-3 w-3 text-gray-500" />
            ) : (
              <ChevronRight className="h-3 w-3 text-gray-500" />
            )}
          </button>
        ) : (
          <div className="w-4" />
        )}

        <button onClick={handleStatusToggle} className="p-0.5 hover:bg-gray-200 rounded">
          {project.status === 'completed' ? (
            <CheckCircle className="h-4 w-4 text-green-500" />
          ) : (
            <Circle className="h-4 w-4 text-gray-400" />
          )}
        </button>

        {getProjectIcon()}

        <span
          className={cn(
            'flex-1 text-sm',
            project.status === 'completed' && 'text-gray-400 line-through',
            project.status === 'dropped' && 'text-gray-300'
          )}
        >
          {project.name}
          {getProjectTypeIndicator()}
        </span>

        {project.taskCount !== undefined && project.taskCount > 0 && (
          <span className="text-xs text-gray-400">{project.taskCount}</span>
        )}

        <button
          onClick={(e) => e.stopPropagation()}
          className="opacity-0 group-hover:opacity-100 p-1 hover:bg-gray-200 rounded"
        >
          <MoreVertical className="h-3 w-3 text-gray-500" />
        </button>
      </div>

      {isExpanded && hasChildren && (
        <div>
          {project.children!.map((child) => (
            <ProjectItem
              key={child.id}
              project={child}
              level={level + 1}
              onSelect={onSelect}
              selectedId={selectedId}
            />
          ))}
        </div>
      )}
    </>
  )
}
