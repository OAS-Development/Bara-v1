import type { OmniFocusData, OmniFocusTask, OmniFocusProject, OmniFocusContext } from './omnifocus-parser'
import type { Task, Project, Tag, TaskInsert, ProjectInsert, TagInsert } from '@/types'

interface ImportMappingOptions {
  projectMapping: Record<string, string> // OF project ID -> Bara project ID
  tagMapping: Record<string, string> // OF context ID -> Bara tag ID
  duplicateStrategy: 'skip' | 'replace' | 'create-new'
  importCompleted: boolean
  preserveHierarchy: boolean
  userId: string
}

interface MappedData {
  projects: ProjectInsert[]
  tags: TagInsert[]
  tasks: TaskInsert[]
  taskTags: { task_id: string; tag_id: string }[]
  stats: {
    totalItems: number
    mappedItems: number
    skippedItems: number
    errors: string[]
  }
}

export class ImportMapper {
  private options: ImportMappingOptions
  private projectIdMap: Map<string, string> = new Map()
  private tagIdMap: Map<string, string> = new Map()
  private errors: string[] = []

  constructor(options: Partial<ImportMappingOptions> & { userId: string }) {
    this.options = {
      projectMapping: {},
      tagMapping: {},
      duplicateStrategy: 'skip',
      importCompleted: false,
      preserveHierarchy: true,
      ...options
    }
  }

  mapOmniFocusData(data: OmniFocusData): MappedData {
    this.errors = []
    
    // First map contexts to tags (needed for task mapping)
    const tags = this.mapContextsToTags(data.contexts)
    
    // Then map projects (needed for task mapping)
    const projects = this.mapProjects(data.projects)
    
    // Finally map all tasks
    const { tasks, taskTags } = this.mapTasks(data)

    const totalItems = data.projects.length + data.contexts.length + 
      data.tasks.length + data.projects.reduce((sum, p) => sum + p.tasks.length, 0)
    
    const mappedItems = projects.length + tags.length + tasks.length

    return {
      projects,
      tags,
      tasks,
      taskTags,
      stats: {
        totalItems,
        mappedItems,
        skippedItems: totalItems - mappedItems,
        errors: this.errors
      }
    }
  }

  private mapContextsToTags(contexts: OmniFocusContext[]): TagInsert[] {
    const tags: TagInsert[] = []
    
    // Sort by hierarchy (parents first)
    const sortedContexts = this.sortByHierarchy(contexts)
    
    for (const context of sortedContexts) {
      try {
        const tagId = this.generateTagId(context.id)
        this.tagIdMap.set(context.id, tagId)
        
        const tag: TagInsert = {
          id: tagId,
          name: context.name,
          color: this.getTagColor(context.name),
          icon: this.getTagIcon(context.name),
          parent_id: context.parentId ? this.tagIdMap.get(context.parentId) || null : null,
          user_id: this.options.userId
        }

        tags.push(tag)
      } catch (error) {
        this.errors.push(`Failed to map context ${context.name}: ${error}`)
      }
    }

    return tags
  }

  private mapProjects(projects: OmniFocusProject[]): ProjectInsert[] {
    const mappedProjects: ProjectInsert[] = []
    
    // Sort by hierarchy (parents first)
    const sortedProjects = this.sortByHierarchy(projects)
    
    for (const project of sortedProjects) {
      try {
        // Skip completed/dropped projects unless explicitly requested
        if (!this.options.importCompleted && 
            (project.status === 'completed' || project.status === 'dropped')) {
          continue
        }

        const projectId = this.generateProjectId(project.id)
        this.projectIdMap.set(project.id, projectId)
        
        const mappedProject: ProjectInsert = {
          id: projectId,
          name: project.name,
          note: project.note || null,
          type: project.type === 'sequential' ? 'sequential' : 
                project.type === 'single-actions' ? 'single-actions' : 'parallel',
          status: this.mapProjectStatus(project.status),
          parent_id: project.parentId ? this.projectIdMap.get(project.parentId) || null : null,
          position: project.order,
          review_interval_days: this.inferReviewInterval(project.name),
          user_id: this.options.userId
        }

        mappedProjects.push(mappedProject)
      } catch (error) {
        this.errors.push(`Failed to map project ${project.name}: ${error}`)
      }
    }

    return mappedProjects
  }

  private mapTasks(data: OmniFocusData): { tasks: TaskInsert[]; taskTags: { task_id: string; tag_id: string }[] } {
    const tasks: TaskInsert[] = []
    const taskTags: { task_id: string; tag_id: string }[] = []
    
    // Map project tasks
    for (const project of data.projects) {
      // Skip if project wasn't imported
      if (!this.projectIdMap.has(project.id)) continue
      
      for (const task of project.tasks) {
        const result = this.mapTask(task)
        if (result) {
          tasks.push(result.task)
          taskTags.push(...result.taskTags)
        }
      }
    }
    
    // Map standalone tasks
    for (const task of data.tasks) {
      const result = this.mapTask(task)
      if (result) {
        tasks.push(result.task)
        taskTags.push(...result.taskTags)
      }
    }

    return { tasks, taskTags }
  }

  private mapTask(task: OmniFocusTask): { task: TaskInsert; taskTags: { task_id: string; tag_id: string }[] } | null {
    try {
      // Skip completed tasks unless requested
      if (!this.options.importCompleted && task.completed) {
        return null
      }

      const taskId = this.generateTaskId(task.id)
      
      const mappedTask: TaskInsert = {
        id: taskId,
        title: task.name,
        note: task.note || null,
        status: task.completed ? 'completed' : 'active',
        completed_at: task.completed ? new Date().toISOString() : null,
        defer_date: task.deferDate ? task.deferDate.toISOString() : null,
        due_date: task.dueDate ? task.dueDate.toISOString() : null,
        project_id: task.projectId ? this.projectIdMap.get(task.projectId) || null : null,
        position: task.order,
        user_id: this.options.userId
      }

      // Create task-tag relationships
      const taskTags: { task_id: string; tag_id: string }[] = []
      if (task.contextId && this.tagIdMap.has(task.contextId)) {
        taskTags.push({
          task_id: taskId,
          tag_id: this.tagIdMap.get(task.contextId)!
        })
      }

      return { task: mappedTask, taskTags }
    } catch (error) {
      this.errors.push(`Failed to map task ${task.name}: ${error}`)
      return null
    }
  }

  private sortByHierarchy<T extends { id: string; parentId?: string }>(items: T[]): T[] {
    const sorted: T[] = []
    const remaining = new Set(items)
    
    // First add all root items
    for (const item of items) {
      if (!item.parentId || !items.find(i => i.id === item.parentId)) {
        sorted.push(item)
        remaining.delete(item)
      }
    }
    
    // Then add children level by level
    while (remaining.size > 0) {
      const toAdd: T[] = []
      
      for (const item of remaining) {
        if (sorted.some(s => s.id === item.parentId)) {
          toAdd.push(item)
        }
      }
      
      if (toAdd.length === 0) {
        // Prevent infinite loop - add remaining items
        remaining.forEach(item => sorted.push(item))
        break
      }
      
      toAdd.forEach(item => {
        sorted.push(item)
        remaining.delete(item)
      })
    }
    
    return sorted
  }

  private mapProjectStatus(status: OmniFocusProject['status']): 'active' | 'completed' | 'dropped' {
    switch (status) {
      case 'active':
        return 'active'
      case 'on-hold':
        return 'active' // We'll use 'someday' flag separately
      case 'completed':
        return 'completed'
      case 'dropped':
        return 'dropped'
      default:
        return 'active'
    }
  }

  private generateProjectId(ofId: string): string {
    return `import-proj-${ofId}-${Date.now()}`
  }

  private generateTagId(ofId: string): string {
    return `import-tag-${ofId}-${Date.now()}`
  }

  private generateTaskId(ofId: string): string {
    return `import-task-${ofId}-${Date.now()}`
  }

  private getTagColor(name: string): string {
    // Map common context names to colors
    const colorMap: Record<string, string> = {
      'home': '#22c55e',
      'work': '#3b82f6',
      'office': '#3b82f6',
      'errands': '#f59e0b',
      'phone': '#8b5cf6',
      'email': '#ef4444',
      'computer': '#6366f1',
      'online': '#6366f1',
      'people': '#ec4899',
      'waiting': '#f97316',
      'anywhere': '#10b981'
    }

    const lowerName = name.toLowerCase()
    for (const [key, color] of Object.entries(colorMap)) {
      if (lowerName.includes(key)) {
        return color
      }
    }

    // Default colors
    const colors = ['#ef4444', '#f59e0b', '#22c55e', '#3b82f6', '#8b5cf6', '#ec4899']
    return colors[Math.floor(Math.random() * colors.length)]
  }

  private getTagIcon(name: string): string {
    // Map common context names to icons
    const iconMap: Record<string, string> = {
      'home': '🏠',
      'work': '💼',
      'office': '🏢',
      'errands': '🚗',
      'phone': '📱',
      'email': '📧',
      'computer': '💻',
      'online': '🌐',
      'people': '👥',
      'waiting': '⏳',
      'anywhere': '📍'
    }

    const lowerName = name.toLowerCase()
    for (const [key, icon] of Object.entries(iconMap)) {
      if (lowerName.includes(key)) {
        return icon
      }
    }

    return '🏷️'
  }

  private inferReviewInterval(projectName: string): number {
    // Infer review intervals from project names
    const lowerName = projectName.toLowerCase()
    
    if (lowerName.includes('daily')) return 1
    if (lowerName.includes('weekly')) return 7
    if (lowerName.includes('monthly')) return 30
    if (lowerName.includes('quarterly')) return 90
    if (lowerName.includes('yearly') || lowerName.includes('annual')) return 365
    
    // Default to weekly reviews
    return 7
  }

  // Validate mapping before import
  validateMapping(data: OmniFocusData): {
    unmappedContexts: string[]
    duplicateTasks: string[]
    warnings: string[]
  } {
    const unmappedContexts = new Set<string>()
    const warnings: string[] = []

    // Check for unmapped contexts
    for (const context of data.contexts) {
      if (!this.options.tagMapping[context.id]) {
        unmappedContexts.add(context.name)
      }
    }

    // Check for duplicate task names
    const taskNames = new Map<string, number>()
    const duplicateTasks: string[] = []
    
    const countTask = (task: OmniFocusTask) => {
      const count = (taskNames.get(task.name) || 0) + 1
      taskNames.set(task.name, count)
      if (count === 2) {
        duplicateTasks.push(task.name)
      }
    }

    data.tasks.forEach(countTask)
    data.projects.forEach(project => project.tasks.forEach(countTask))

    // Check for very large imports
    const totalTasks = data.tasks.length + 
      data.projects.reduce((sum, p) => sum + p.tasks.length, 0)
    
    if (totalTasks > 1000) {
      warnings.push(`Large import detected: ${totalTasks} tasks. This may take a while.`)
    }

    return {
      unmappedContexts: Array.from(unmappedContexts),
      duplicateTasks,
      warnings
    }
  }
}