import { create } from 'zustand'
import { createClient } from '@/lib/supabase/client'
import { Database } from '@/types/database.types'

type Project = Database['public']['Tables']['projects']['Row']
type ProjectInsert = Database['public']['Tables']['projects']['Insert']
type ProjectUpdate = Database['public']['Tables']['projects']['Update']

interface ProjectWithChildren extends Project {
  children?: ProjectWithChildren[]
  taskCount?: number
}

interface ProjectState {
  projects: Project[]
  projectsTree: ProjectWithChildren[]
  loading: boolean
  error: string | null
  
  fetchProjects: () => Promise<void>
  createProject: (project: ProjectInsert) => Promise<Project | null>
  updateProject: (id: string, update: ProjectUpdate) => Promise<void>
  deleteProject: (id: string) => Promise<void>
  getProjectById: (id: string) => Project | undefined
  buildProjectTree: (projects: Project[]) => ProjectWithChildren[]
}

const supabase = createClient()

export const useProjectStore = create<ProjectState>((set, get) => ({
  projects: [],
  projectsTree: [],
  loading: false,
  error: null,

  fetchProjects: async () => {
    set({ loading: true })
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('No authenticated user')

      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('user_id', user.id)
        .order('position', { ascending: true })
        .order('name', { ascending: true })

      if (error) throw error

      const projects = data || []
      const projectsTree = get().buildProjectTree(projects)
      
      set({ projects, projectsTree, loading: false, error: null })
    } catch (error) {
      set({ loading: false, error: error instanceof Error ? error.message : 'Failed to fetch projects' })
    }
  },

  createProject: async (project) => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('No authenticated user')

      const { data, error } = await supabase
        .from('projects')
        .insert({ ...project, user_id: user.id })
        .select()
        .single()

      if (error) throw error

      const projects = [...get().projects, data]
      const projectsTree = get().buildProjectTree(projects)
      set({ projects, projectsTree })
      
      return data
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to create project' })
      return null
    }
  },

  updateProject: async (id, update) => {
    try {
      const { error } = await supabase
        .from('projects')
        .update(update)
        .eq('id', id)

      if (error) throw error

      const projects = get().projects.map(p => 
        p.id === id ? { ...p, ...update } : p
      )
      const projectsTree = get().buildProjectTree(projects)
      set({ projects, projectsTree })
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to update project' })
    }
  },

  deleteProject: async (id) => {
    try {
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', id)

      if (error) throw error

      const projects = get().projects.filter(p => p.id !== id)
      const projectsTree = get().buildProjectTree(projects)
      set({ projects, projectsTree })
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to delete project' })
    }
  },

  getProjectById: (id) => {
    return get().projects.find(p => p.id === id)
  },

  buildProjectTree: (projects) => {
    const projectMap = new Map<string, ProjectWithChildren>()
    const rootProjects: ProjectWithChildren[] = []

    // First pass: create all projects
    projects.forEach(project => {
      projectMap.set(project.id, { ...project, children: [] })
    })

    // Second pass: build hierarchy
    projects.forEach(project => {
      const projectWithChildren = projectMap.get(project.id)!
      if (project.parent_id) {
        const parent = projectMap.get(project.parent_id)
        if (parent && parent.children) {
          parent.children.push(projectWithChildren)
        }
      } else {
        rootProjects.push(projectWithChildren)
      }
    })

    // Sort children recursively
    const sortProjects = (projects: ProjectWithChildren[]) => {
      projects.sort((a, b) => {
        const sortDiff = (a.position ?? 0) - (b.position ?? 0)
        if (sortDiff !== 0) return sortDiff
        return (a.name ?? '').localeCompare(b.name ?? '')
      })
      projects.forEach(p => {
        if (p.children && p.children.length > 0) {
          sortProjects(p.children)
        }
      })
    }

    sortProjects(rootProjects)
    return rootProjects
  }
}))