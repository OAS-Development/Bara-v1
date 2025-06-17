import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import type { Database } from '@/types/database.types'
import type { OmniFocusData } from './omnifocus-parser'
import { ImportMapper } from './import-mapper'

export interface ImportProgress {
  total: number
  current: number
  phase: 'preparing' | 'tags' | 'projects' | 'tasks' | 'completing' | 'done' | 'error'
  message: string
  errors: string[]
}

export interface ImportResult {
  success: boolean
  projectsImported: number
  tasksImported: number
  tagsImported: number
  duplicatesSkipped: number
  errors: string[]
  duration: number
}

export interface ImportOptions {
  duplicateStrategy: 'skip' | 'replace' | 'create-new'
  importCompleted: boolean
  preserveHierarchy: boolean
  onProgress?: (progress: ImportProgress) => void
}

export class ImportExecutor {
  private supabase = createClientComponentClient<Database>()
  private progress: ImportProgress = {
    total: 0,
    current: 0,
    phase: 'preparing',
    message: 'Initializing import...',
    errors: []
  }
  private onProgress?: (progress: ImportProgress) => void

  constructor(private options: ImportOptions) {
    this.onProgress = options.onProgress
  }

  async execute(data: OmniFocusData): Promise<ImportResult> {
    const startTime = Date.now()
    const result: ImportResult = {
      success: false,
      projectsImported: 0,
      tasksImported: 0,
      tagsImported: 0,
      duplicatesSkipped: 0,
      errors: [],
      duration: 0
    }

    try {
      this.updateProgress('preparing', 'Validating import data...')

      // Get current user
      const {
        data: { user }
      } = await this.supabase.auth.getUser()
      if (!user) throw new Error('User not authenticated')

      // Create mapper with user ID
      const mapper = new ImportMapper({
        ...this.options,
        userId: user.id
      })

      // Validate and map data
      const validation = mapper.validateMapping(data)
      if (validation.warnings.length > 0) {
        this.progress.errors.push(...validation.warnings)
      }

      const mappedData = mapper.mapOmniFocusData(data)

      // Update total items
      this.progress.total =
        mappedData.projects.length + mappedData.tags.length + mappedData.tasks.length

      // Import in order: tags first, then projects, then tasks
      this.updateProgress('tags', 'Importing tags...')
      await this.importTags(mappedData.tags, result)

      this.updateProgress('projects', 'Importing projects...')
      await this.importProjects(mappedData.projects, result)

      this.updateProgress('tasks', 'Importing tasks...')
      await this.importTasks(mappedData.tasks, mappedData.taskTags, result)

      this.updateProgress('completing', 'Finalizing import...')

      // Add import marker tag to all imported tasks if requested
      if (this.options.preserveHierarchy) {
        await this.addImportMetadata(user.id)
      }

      result.success = true
      result.duration = Date.now() - startTime
      this.updateProgress(
        'done',
        `Import completed! ${result.tasksImported} tasks, ${result.projectsImported} projects, ${result.tagsImported} tags imported.`
      )
    } catch (error) {
      result.errors.push(error instanceof Error ? error.message : 'Unknown error')
      this.updateProgress('error', 'Import failed')
      throw error
    }

    return result
  }

  private async importTags(tags: any[], result: ImportResult): Promise<void> {
    const batchSize = 50

    for (let i = 0; i < tags.length; i += batchSize) {
      const batch = tags.slice(i, i + batchSize)

      try {
        // Check for existing tags
        const tagNames = batch.map((t) => t.name)
        const { data: existing } = await this.supabase
          .from('tags')
          .select('id, name')
          .eq('user_id', batch[0].user_id)
          .in('name', tagNames)

        const existingNames = new Set(existing?.map((e) => e.name) || [])

        // Filter out duplicates based on strategy
        const toImport = batch.filter((tag) => {
          if (existingNames.has(tag.name)) {
            if (this.options.duplicateStrategy === 'skip') {
              result.duplicatesSkipped++
              return false
            }
            // For 'create-new', we'll add a suffix
            if (this.options.duplicateStrategy === 'create-new') {
              tag.name = `${tag.name} (imported)`
            }
          }
          return true
        })

        if (toImport.length > 0) {
          const { error } = await this.supabase.from('tags').insert(toImport)

          if (error) throw error
          result.tagsImported += toImport.length
        }

        this.progress.current += batch.length
        this.updateProgress('tags', `Imported ${result.tagsImported} tags...`)
      } catch (error) {
        const message = `Failed to import tag batch: ${error instanceof Error ? error.message : 'Unknown error'}`
        result.errors.push(message)
        this.progress.errors.push(message)
      }
    }
  }

  private async importProjects(projects: any[], result: ImportResult): Promise<void> {
    // Import projects in order to preserve hierarchy
    for (const project of projects) {
      try {
        // Check for duplicates
        const { data: existing } = await this.supabase
          .from('projects')
          .select('id')
          .eq('user_id', project.user_id)
          .eq('name', project.name)
          .single()

        if (existing) {
          if (this.options.duplicateStrategy === 'skip') {
            result.duplicatesSkipped++
            this.progress.current++
            continue
          }
          if (this.options.duplicateStrategy === 'create-new') {
            project.name = `${project.name} (imported)`
          }
        }

        const { error } = await this.supabase.from('projects').insert(project)

        if (error) throw error
        result.projectsImported++

        this.progress.current++
        this.updateProgress('projects', `Imported project: ${project.name}`)
      } catch (error) {
        const message = `Failed to import project "${project.name}": ${error instanceof Error ? error.message : 'Unknown error'}`
        result.errors.push(message)
        this.progress.errors.push(message)
      }
    }
  }

  private async importTasks(tasks: any[], taskTags: any[], result: ImportResult): Promise<void> {
    const batchSize = 100

    // Import tasks in batches
    for (let i = 0; i < tasks.length; i += batchSize) {
      const batch = tasks.slice(i, i + batchSize)

      try {
        // Check for duplicates
        const taskTitles = batch.map((t) => t.title)
        const { data: existing } = await this.supabase
          .from('tasks')
          .select('id, title, project_id')
          .eq('user_id', batch[0].user_id)
          .in('title', taskTitles)

        const existingMap = new Map(
          existing?.map((e) => [`${e.title}-${e.project_id || 'inbox'}`, e]) || []
        )

        // Filter out duplicates based on strategy
        const toImport = batch.filter((task) => {
          const key = `${task.title}-${task.project_id || 'inbox'}`
          if (existingMap.has(key)) {
            if (this.options.duplicateStrategy === 'skip') {
              result.duplicatesSkipped++
              return false
            }
            if (this.options.duplicateStrategy === 'create-new') {
              task.title = `${task.title} (imported)`
            }
          }
          return true
        })

        if (toImport.length > 0) {
          const { error } = await this.supabase.from('tasks').insert(toImport)

          if (error) throw error
          result.tasksImported += toImport.length
        }

        this.progress.current += batch.length
        this.updateProgress('tasks', `Imported ${result.tasksImported} tasks...`)
      } catch (error) {
        const message = `Failed to import task batch: ${error instanceof Error ? error.message : 'Unknown error'}`
        result.errors.push(message)
        this.progress.errors.push(message)
      }
    }

    // Import task-tag relationships
    if (taskTags.length > 0) {
      try {
        // Import in smaller batches to avoid conflicts
        for (let i = 0; i < taskTags.length; i += 100) {
          const batch = taskTags.slice(i, i + 100)
          await this.supabase.from('task_tags').insert(batch).select() // Ignore duplicates
        }
      } catch (error) {
        // Non-critical error - just log it
        this.progress.errors.push(`Some task-tag relationships could not be imported`)
      }
    }
  }

  private async addImportMetadata(userId: string): Promise<void> {
    try {
      // Create or get import tag
      const importDate = new Date().toISOString().split('T')[0]
      const tagName = `imported-${importDate}`

      let tagId: string
      const { data: existingTag } = await this.supabase
        .from('tags')
        .select('id')
        .eq('user_id', userId)
        .eq('name', tagName)
        .single()

      if (existingTag) {
        tagId = existingTag.id
      } else {
        const { data: newTag, error } = await this.supabase
          .from('tags')
          .insert({
            user_id: userId,
            name: tagName,
            color: '#9CA3AF',
            icon: '📥'
          })
          .select()
          .single()

        if (error || !newTag) return
        tagId = newTag.id
      }

      // Add import tag to all tasks created in the last minute
      const oneMinuteAgo = new Date(Date.now() - 60000).toISOString()
      const { data: recentTasks } = await this.supabase
        .from('tasks')
        .select('id')
        .eq('user_id', userId)
        .gte('created_at', oneMinuteAgo)

      if (recentTasks && recentTasks.length > 0) {
        const taskTagInserts = recentTasks.map((task) => ({
          task_id: task.id,
          tag_id: tagId
        }))

        await this.supabase.from('task_tags').insert(taskTagInserts).select() // Ignore duplicates
      }
    } catch (error) {
      // Non-critical - just log
      this.progress.errors.push('Could not add import metadata tag')
    }
  }

  private updateProgress(phase: ImportProgress['phase'], message: string): void {
    this.progress.phase = phase
    this.progress.message = message
    this.onProgress?.(this.progress)
  }

  // Generate import report
  generateReport(result: ImportResult, data: OmniFocusData): string {
    const report = [
      '# OmniFocus Import Report',
      '',
      `Import Date: ${new Date().toLocaleString()}`,
      `Duration: ${(result.duration / 1000).toFixed(1)} seconds`,
      '',
      '## Summary',
      `- Projects imported: ${result.projectsImported}`,
      `- Tasks imported: ${result.tasksImported}`,
      `- Tags imported: ${result.tagsImported}`,
      `- Duplicates skipped: ${result.duplicatesSkipped}`,
      '',
      '## Original Data',
      `- Total projects: ${data.projects.length}`,
      `- Total tasks: ${data.tasks.length + data.projects.reduce((sum, p) => sum + p.tasks.length, 0)}`,
      `- Total contexts: ${data.contexts.length}`,
      ''
    ]

    if (result.errors.length > 0) {
      report.push('## Errors')
      result.errors.forEach((error) => {
        report.push(`- ${error}`)
      })
      report.push('')
    }

    if (this.progress.errors.length > 0) {
      report.push('## Warnings')
      this.progress.errors.forEach((warning) => {
        report.push(`- ${warning}`)
      })
    }

    return report.join('\n')
  }
}
