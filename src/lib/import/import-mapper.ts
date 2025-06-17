import { OmniFocusData, OmniFocusTask, OmniFocusProject, OmniFocusContext } from './omnifocus-parser'
import { Task, Project } from '@/types'

export interface ImportMapping {
  contextToTag: Record<string, string>
  projectTypeMap: Record<string, string>
  skipProjects: string[]
  skipContexts: string[]
}

export const defaultMapping: ImportMapping = {
  contextToTag: {
    'Home': 'home',
    'Office': 'work',
    'Mac': 'computer',
    'iPhone': 'mobile',
    'Errands': 'errands',
    'Calls': 'calls',
    'Email': 'email',
    'Waiting': 'waiting-for'
  },
  projectTypeMap: {
    'parallel': 'active',
    'sequential': 'active',
    'single-actions': 'single-actions'
  },
  skipProjects: [],
  skipContexts: []
}

export class ImportMapper {
  constructor(private mapping: ImportMapping = defaultMapping) {}

  mapProject(ofProject: OmniFocusProject): Partial<Project> {
    if (this.mapping.skipProjects.includes(ofProject.name)) {
      throw new Error(`Skipping project: ${ofProject.name}`)
    }

    return {
      name: ofProject.name,
      status: ofProject.status === 'active' ? 'active' : 
              ofProject.status === 'on-hold' ? 'someday' : 
              ofProject.status === 'completed' ? 'completed' : 
              ofProject.status === 'dropped' ? 'dropped' : 'active',
      notes: ofProject.note || undefined,
      created_at: this.parseDate(ofProject.added),
      updated_at: this.parseDate(ofProject.modified),
      completed_at: ofProject.completed ? this.parseDate(ofProject.completed) : undefined,
      review_interval_days: this.parseReviewInterval(ofProject.reviewInterval),
      next_review_date: ofProject.nextReview ? this.parseDate(ofProject.nextReview) : undefined
    }
  }

  mapTask(ofTask: OmniFocusTask, projectId?: string): Partial<Task> {
    const tags = this.mapContextsToTags(ofTask.context)
    
    return {
      title: ofTask.name,
      notes: ofTask.note || undefined,
      project_id: projectId || null,
      tags: tags,
      due_date: ofTask.due ? this.parseDate(ofTask.due) : undefined,
      defer_date: ofTask.defer ? this.parseDate(ofTask.defer) : undefined,
      completed_at: ofTask.completed ? this.parseDate(ofTask.completed) : undefined,
      flagged: ofTask.flagged || false,
      created_at: this.parseDate(ofTask.added),
      updated_at: this.parseDate(ofTask.modified),
      
      // Map OF fields to our fields
      energy_required: this.mapEstimatedMinutes(ofTask.estimatedMinutes),
      location: undefined, // Will be set in location context
      time_of_day: undefined // Will be set in time context
    }
  }

  private mapContextsToTags(context?: OmniFocusContext | string): string[] {
    if (!context) return []
    
    const contextName = typeof context === 'string' ? context : context.name
    
    if (this.mapping.skipContexts.includes(contextName)) {
      return []
    }
    
    const mappedTag = this.mapping.contextToTag[contextName]
    if (mappedTag) {
      return [mappedTag]
    }
    
    // If no mapping exists, create a tag from the context name
    return [contextName.toLowerCase().replace(/\s+/g, '-')]
  }

  private parseDate(dateStr?: string): string | undefined {
    if (!dateStr) return undefined
    
    try {
      const date = new Date(dateStr)
      if (isNaN(date.getTime())) return undefined
      return date.toISOString()
    } catch {
      return undefined
    }
  }

  private parseReviewInterval(interval?: string): number | undefined {
    if (!interval) return undefined
    
    // Parse intervals like "1 week", "2 months", etc.
    const match = interval.match(/(\d+)\s*(day|week|month|year)/)
    if (!match) return undefined
    
    const [, num, unit] = match
    const value = parseInt(num)
    
    switch (unit) {
      case 'day': return value
      case 'week': return value * 7
      case 'month': return value * 30
      case 'year': return value * 365
      default: return undefined
    }
  }

  private mapEstimatedMinutes(minutes?: number): 'low' | 'medium' | 'high' | undefined {
    if (!minutes) return undefined
    
    if (minutes <= 15) return 'low'
    if (minutes <= 45) return 'medium'
    return 'high'
  }

  // Validate mapping before import
  validateMapping(data: OmniFocusData): {
    unmappedContexts: string[]
    unmappedProjectTypes: string[]
    warnings: string[]
  } {
    const unmappedContexts = new Set<string>()
    const unmappedProjectTypes = new Set<string>()
    const warnings: string[] = []

    // Check for unmapped contexts
    const allContexts = this.extractAllContexts(data)
    for (const context of allContexts) {
      if (!this.mapping.contextToTag[context] && !this.mapping.skipContexts.includes(context)) {
        unmappedContexts.add(context)
      }
    }

    // Check for duplicate task names
    const taskNames = new Map<string, number>()
    const allTasks = this.extractAllTasks(data)
    for (const task of allTasks) {
      const count = (taskNames.get(task.name) || 0) + 1
      taskNames.set(task.name, count)
      if (count === 2) {
        warnings.push(`Duplicate task name: "${task.name}"`)
      }
    }

    return {
      unmappedContexts: Array.from(unmappedContexts),
      unmappedProjectTypes: Array.from(unmappedProjectTypes),
      warnings
    }
  }

  private extractAllContexts(data: OmniFocusData): string[] {
    const contexts = new Set<string>()
    
    const processTask = (task: OmniFocusTask) => {
      if (task.context) {
        const contextName = typeof task.context === 'string' ? task.context : task.context.name
        contexts.add(contextName)
      }
      task.tasks?.forEach(processTask)
    }

    data.tasks.forEach(processTask)
    data.projects.forEach(project => project.tasks?.forEach(processTask))
    
    return Array.from(contexts)
  }

  private extractAllTasks(data: OmniFocusData): OmniFocusTask[] {
    const tasks: OmniFocusTask[] = []
    
    const processTask = (task: OmniFocusTask) => {
      tasks.push(task)
      task.tasks?.forEach(processTask)
    }

    data.tasks.forEach(processTask)
    data.projects.forEach(project => project.tasks?.forEach(processTask))
    
    return tasks
  }
}