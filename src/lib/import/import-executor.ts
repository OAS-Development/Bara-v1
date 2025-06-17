import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Database } from '@/types/supabase'
import { OmniFocusData, OmniFocusTask, OmniFocusProject } from './omnifocus-parser'
import { ImportMapper, ImportMapping } from './import-mapper'
import { Task, Project } from '@/types'

export interface ImportProgress {
  total: number
  current: number
  phase: 'preparing' | 'projects' | 'tasks' | 'completing' | 'done' | 'error'
  message: string
  errors: string[]
}

export interface ImportResult {
  success: boolean
  projectsImported: number
  tasksImported: number
  duplicatesSkipped: number
  errors: string[]
  duration: number
}

export class ImportExecutor {
  private supabase = createClientComponentClient<Database>()
  private mapper: ImportMapper
  private progress: ImportProgress = {
    total: 0,
    current: 0,
    phase: 'preparing',
    message: 'Initializing import...',
    errors: []
  }
  private onProgress?: (progress: ImportProgress) => void

  constructor(
    mapping: ImportMapping,
    onProgress?: (progress: ImportProgress) => void
  ) {
    this.mapper = new ImportMapper(mapping)
    this.onProgress = onProgress
  }

  async execute(data: OmniFocusData): Promise<ImportResult> {
    const startTime = Date.now()
    const result: ImportResult = {
      success: false,
      projectsImported: 0,
      tasksImported: 0,
      duplicatesSkipped: 0,
      errors: [],
      duration: 0
    }

    try {
      // Calculate total items
      const totalProjects = data.projects.length
      const totalTasks = this.countAllTasks(data)
      this.progress.total = totalProjects + totalTasks

      this.updateProgress('preparing', 'Validating import data...')
      
      // Validate mapping
      const validation = this.mapper.validateMapping(data)
      if (validation.warnings.length > 0) {
        this.progress.errors.push(...validation.warnings)
      }

      // Get current user
      const { data: { user } } = await this.supabase.auth.getUser()
      if (!user) throw new Error('User not authenticated')

      // Start transaction-like behavior using batches
      this.updateProgress('projects', 'Importing projects...')
      const projectMap = await this.importProjects(data.projects, user.id, result)

      this.updateProgress('tasks', 'Importing tasks...')
      await this.importTasks(data, projectMap, user.id, result)

      this.updateProgress('completing', 'Finalizing import...')
      
      // Create import tags if they don't exist
      await this.ensureImportTags(user.id)

      result.success = true
      result.duration = Date.now() - startTime
      this.updateProgress('done', 'Import completed successfully!')

    } catch (error) {
      result.errors.push(error instanceof Error ? error.message : 'Unknown error')
      this.updateProgress('error', 'Import failed')
      throw error
    }

    return result
  }

  private async importProjects(
    projects: OmniFocusProject[],
    userId: string,
    result: ImportResult
  ): Promise<Map<string, string>> {
    const projectMap = new Map<string, string>()

    for (const ofProject of projects) {
      try {
        // Check for duplicates
        const { data: existing } = await this.supabase
          .from('projects')
          .select('id')
          .eq('user_id', userId)
          .eq('name', ofProject.name)
          .single()

        if (existing) {
          result.duplicatesSkipped++
          projectMap.set(ofProject.id, existing.id)
          continue
        }

        // Map and create project
        const projectData = this.mapper.mapProject(ofProject)
        const { data: newProject, error } = await this.supabase
          .from('projects')
          .insert({
            ...projectData,
            user_id: userId,
            color: this.generateProjectColor()
          })
          .select()
          .single()

        if (error) throw error
        if (newProject) {
          projectMap.set(ofProject.id, newProject.id)
          result.projectsImported++
        }

        this.progress.current++
        this.updateProgress('projects', `Imported project: ${ofProject.name}`)
      } catch (error) {
        const message = `Failed to import project "${ofProject.name}": ${error instanceof Error ? error.message : 'Unknown error'}`
        result.errors.push(message)
        this.progress.errors.push(message)
      }
    }

    return projectMap
  }

  private async importTasks(
    data: OmniFocusData,
    projectMap: Map<string, string>,
    userId: string,
    result: ImportResult
  ): Promise<void> {
    // Import inbox tasks
    for (const task of data.tasks) {
      await this.importTask(task, undefined, userId, projectMap, result)
    }

    // Import project tasks
    for (const project of data.projects) {
      const projectId = projectMap.get(project.id)
      if (projectId && project.tasks) {
        for (const task of project.tasks) {
          await this.importTask(task, projectId, userId, projectMap, result)
        }
      }
    }
  }

  private async importTask(
    ofTask: OmniFocusTask,
    projectId: string | undefined,
    userId: string,
    projectMap: Map<string, string>,
    result: ImportResult,
    parentId?: string
  ): Promise<void> {
    try {
      // Check for duplicates
      const { data: existing } = await this.supabase
        .from('tasks')
        .select('id')
        .eq('user_id', userId)
        .eq('title', ofTask.name)
        .eq('project_id', projectId || null)
      
      if (existing && existing.length > 0) {
        result.duplicatesSkipped++
        this.progress.current++
        return
      }

      // Map and create task
      const taskData = this.mapper.mapTask(ofTask, projectId)
      const { data: newTask, error } = await this.supabase
        .from('tasks')
        .insert({
          ...taskData,
          user_id: userId,
          parent_id: parentId || null,
          status: ofTask.completed ? 'completed' : 'next',
          order_index: 0
        })
        .select()
        .single()

      if (error) throw error
      
      result.tasksImported++
      this.progress.current++
      this.updateProgress('tasks', `Imported task: ${ofTask.name}`)

      // Import subtasks
      if (newTask && ofTask.tasks && ofTask.tasks.length > 0) {
        for (const subtask of ofTask.tasks) {
          await this.importTask(subtask, projectId, userId, projectMap, result, newTask.id)
        }
      }

      // Add tags
      if (newTask && taskData.tags && taskData.tags.length > 0) {
        await this.addTaskTags(newTask.id, taskData.tags, userId)
      }

    } catch (error) {
      const message = `Failed to import task "${ofTask.name}": ${error instanceof Error ? error.message : 'Unknown error'}`
      result.errors.push(message)
      this.progress.errors.push(message)
      this.progress.current++
    }
  }

  private async addTaskTags(taskId: string, tags: string[], userId: string): Promise<void> {
    for (const tagName of tags) {
      // Ensure tag exists
      const { data: tag } = await this.supabase
        .from('tags')
        .select('id')
        .eq('user_id', userId)
        .eq('name', tagName)
        .single()

      let tagId: string
      if (!tag) {
        // Create tag
        const { data: newTag, error } = await this.supabase
          .from('tags')
          .insert({
            user_id: userId,
            name: tagName,
            color: this.generateTagColor()
          })
          .select()
          .single()

        if (error || !newTag) continue
        tagId = newTag.id
      } else {
        tagId = tag.id
      }

      // Create task-tag association
      await this.supabase
        .from('task_tags')
        .insert({
          task_id: taskId,
          tag_id: tagId
        })
    }
  }

  private async ensureImportTags(userId: string): Promise<void> {
    const importTags = ['imported', 'omnifocus-import']
    
    for (const tagName of importTags) {
      const { data: existing } = await this.supabase
        .from('tags')
        .select('id')
        .eq('user_id', userId)
        .eq('name', tagName)
        .single()

      if (!existing) {
        await this.supabase
          .from('tags')
          .insert({
            user_id: userId,
            name: tagName,
            color: '#9CA3AF' // Gray color for import tags
          })
      }
    }
  }

  private countAllTasks(data: OmniFocusData): number {
    let count = 0
    
    const countTask = (task: OmniFocusTask) => {
      count++
      task.tasks?.forEach(countTask)
    }

    data.tasks.forEach(countTask)
    data.projects.forEach(project => project.tasks?.forEach(countTask))
    
    return count
  }

  private updateProgress(phase: ImportProgress['phase'], message: string): void {
    this.progress.phase = phase
    this.progress.message = message
    this.onProgress?.(this.progress)
  }

  private generateProjectColor(): string {
    const colors = ['#EF4444', '#F59E0B', '#10B981', '#3B82F6', '#8B5CF6', '#EC4899']
    return colors[Math.floor(Math.random() * colors.length)]
  }

  private generateTagColor(): string {
    const colors = ['#DC2626', '#D97706', '#059669', '#2563EB', '#7C3AED', '#DB2777']
    return colors[Math.floor(Math.random() * colors.length)]
  }
}