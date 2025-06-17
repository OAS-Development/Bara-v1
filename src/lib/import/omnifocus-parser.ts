interface OFTask {
  id: string
  name: string
  note?: string
  completed: boolean
  flagged: boolean
  deferDate?: Date
  dueDate?: Date
  projectId?: string
  contextId?: string
  order: number
}

interface OFProject {
  id: string
  name: string
  note?: string
  status: 'active' | 'on-hold' | 'completed' | 'dropped'
  type: 'sequential' | 'parallel' | 'single-actions'
  parentId?: string
  order: number
  tasks: OFTask[]
}

interface OFContext {
  id: string
  name: string
  parentId?: string
  location?: {
    latitude: number
    longitude: number
    radius: number
  }
}

interface OFArchive {
  projects: OFProject[]
  contexts: OFContext[]
  tasks: OFTask[]
}

export class OmniFocusParser {
  private parser: DOMParser

  constructor() {
    this.parser = new DOMParser()
  }

  async parseArchive(file: File): Promise<OFArchive> {
    const text = await file.text()
    const doc = this.parser.parseFromString(text, 'text/xml')

    // Check if it's a valid OmniFocus document
    const root = doc.documentElement
    if (!root || root.tagName !== 'omnifocus') {
      throw new Error('Invalid OmniFocus archive file')
    }

    const projects = this.parseProjects(doc)
    const contexts = this.parseContexts(doc)
    const tasks = this.parseTasks(doc)

    return { projects, contexts, tasks }
  }

  private parseProjects(doc: Document): OFProject[] {
    const projects: OFProject[] = []
    const projectElements = doc.querySelectorAll('project')

    projectElements.forEach((element, index) => {
      const project: OFProject = {
        id: element.getAttribute('id') || `project-${index}`,
        name: element.querySelector('name')?.textContent || 'Untitled Project',
        note: element.querySelector('note')?.textContent || undefined,
        status: this.parseProjectStatus(element.getAttribute('status')),
        type: this.parseProjectType(element.getAttribute('type')),
        parentId: element.getAttribute('parent') || undefined,
        order: parseInt(element.getAttribute('order') || '0'),
        tasks: []
      }

      // Parse tasks within this project
      const taskElements = element.querySelectorAll('task')
      taskElements.forEach((taskEl, taskIndex) => {
        const task = this.parseTask(taskEl, taskIndex)
        if (task) {
          task.projectId = project.id
          project.tasks.push(task)
        }
      })

      projects.push(project)
    })

    return projects
  }

  private parseContexts(doc: Document): OFContext[] {
    const contexts: OFContext[] = []
    const contextElements = doc.querySelectorAll('context')

    contextElements.forEach((element, index) => {
      const context: OFContext = {
        id: element.getAttribute('id') || `context-${index}`,
        name: element.querySelector('name')?.textContent || 'Untitled Context',
        parentId: element.getAttribute('parent') || undefined
      }

      // Parse location if available
      const locationEl = element.querySelector('location')
      if (locationEl) {
        const lat = locationEl.getAttribute('latitude')
        const lng = locationEl.getAttribute('longitude')
        const radius = locationEl.getAttribute('radius')
        
        if (lat && lng) {
          context.location = {
            latitude: parseFloat(lat),
            longitude: parseFloat(lng),
            radius: radius ? parseFloat(radius) : 100
          }
        }
      }

      contexts.push(context)
    })

    return contexts
  }

  private parseTasks(doc: Document): OFTask[] {
    const tasks: OFTask[] = []
    
    // Parse standalone tasks (not in projects)
    const taskElements = doc.querySelectorAll('omnifocus > task')
    
    taskElements.forEach((element, index) => {
      const task = this.parseTask(element, index)
      if (task) {
        tasks.push(task)
      }
    })

    return tasks
  }

  private parseTask(element: Element, index: number): OFTask | null {
    const name = element.querySelector('name')?.textContent
    if (!name) return null

    const task: OFTask = {
      id: element.getAttribute('id') || `task-${index}`,
      name,
      note: element.querySelector('note')?.textContent || undefined,
      completed: element.getAttribute('completed') === 'true',
      flagged: element.getAttribute('flagged') === 'true',
      order: parseInt(element.getAttribute('order') || '0'),
      contextId: element.getAttribute('context') || undefined
    }

    // Parse dates
    const deferDateStr = element.getAttribute('defer-date')
    const dueDateStr = element.getAttribute('due-date')
    
    if (deferDateStr) {
      task.deferDate = new Date(deferDateStr)
    }
    
    if (dueDateStr) {
      task.dueDate = new Date(dueDateStr)
    }

    return task
  }

  private parseProjectStatus(status?: string | null): OFProject['status'] {
    switch (status) {
      case 'on-hold':
        return 'on-hold'
      case 'completed':
        return 'completed'
      case 'dropped':
        return 'dropped'
      default:
        return 'active'
    }
  }

  private parseProjectType(type?: string | null): OFProject['type'] {
    switch (type) {
      case 'sequential':
        return 'sequential'
      case 'single-actions':
        return 'single-actions'
      default:
        return 'parallel'
    }
  }

  // Utility method to get statistics
  getStatistics(archive: OFArchive) {
    const totalProjects = archive.projects.length
    const activeProjects = archive.projects.filter(p => p.status === 'active').length
    const totalTasks = archive.tasks.length + 
      archive.projects.reduce((sum, p) => sum + p.tasks.length, 0)
    const completedTasks = archive.tasks.filter(t => t.completed).length +
      archive.projects.reduce((sum, p) => sum + p.tasks.filter(t => t.completed).length, 0)
    const totalContexts = archive.contexts.length

    return {
      totalProjects,
      activeProjects,
      totalTasks,
      completedTasks,
      totalContexts,
      completionRate: totalTasks > 0 ? (completedTasks / totalTasks * 100).toFixed(1) : '0'
    }
  }
}