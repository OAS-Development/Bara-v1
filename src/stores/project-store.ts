import { create } from 'zustand'
import { api, isApiError, type ApiError } from '@/lib/api/client'
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
  error: ApiError | null

  fetchProjects: () => Promise<void>
  createProject: (project: ProjectInsert) => Promise<Project | null>
  updateProject: (id: string, update: ProjectUpdate) => Promise<void>
  deleteProject: (id: string) => Promise<void>
  getProjectById: (id: string) => Project | undefined
  buildProjectTree: (projects: Project[]) => ProjectWithChildren[]
  clearError: () => void
}

export const useProjectStore = create<ProjectState>((set, get) => ({
  projects: [],
  projectsTree: [],
  loading: false,
  error: null,

  fetchProjects: async () => {
    set({ loading: true, error: null })
    
    const userResult = await api.query(
      () => api.client.auth.getUser(),
      { showToast: false }
    )

    if (isApiError(userResult) || !userResult.data.user) {
      set({ loading: false, error: { message: 'No authenticated user' } })
      return
    }

    const result = await api.query(
      () => api.client
        .from('projects')
        .select('*')
        .eq('user_id', userResult.data.user.id)
        .order('position', { ascending: true })
        .order('name', { ascending: true }),
      { errorContext: 'Failed to fetch projects' }
    )

    if (isApiError(result)) {
      set({ loading: false, error: result.error })
      return
    }

    const projects = result.data
    const projectsTree = get().buildProjectTree(projects)

    set({ projects, projectsTree, loading: false, error: null })
  },

  createProject: async (project) => {
    set({ error: null })
    
    const userResult = await api.query(
      () => api.client.auth.getUser(),
      { showToast: false }
    )

    if (isApiError(userResult) || !userResult.data.user) {
      set({ error: { message: 'No authenticated user' } })
      return null
    }

    const result = await api.mutate(
      () => api.client
        .from('projects')
        .insert({ ...project, user_id: userResult.data.user.id })
        .select()
        .single(),
      { 
        successMessage: 'Project created successfully',
        errorContext: 'Failed to create project' 
      }
    )

    if (isApiError(result)) {
      set({ error: result.error })
      return null
    }

    const projects = [...get().projects, result.data]
    const projectsTree = get().buildProjectTree(projects)
    set({ projects, projectsTree })

    return result.data
  },

  updateProject: async (id, update) => {
    set({ error: null })
    
    const result = await api.mutate(
      () => api.client.from('projects').update(update).eq('id', id),
      { 
        successMessage: 'Project updated successfully',
        errorContext: 'Failed to update project' 
      }
    )

    if (isApiError(result)) {
      set({ error: result.error })
      return
    }

    const projects = get().projects.map((p) => (p.id === id ? { ...p, ...update } : p))
    const projectsTree = get().buildProjectTree(projects)
    set({ projects, projectsTree })
  },

  deleteProject: async (id) => {
    set({ error: null })
    
    const result = await api.mutate(
      () => api.client.from('projects').delete().eq('id', id),
      { 
        successMessage: 'Project deleted successfully',
        errorContext: 'Failed to delete project' 
      }
    )

    if (isApiError(result)) {
      set({ error: result.error })
      return
    }

    const projects = get().projects.filter((p) => p.id !== id)
    const projectsTree = get().buildProjectTree(projects)
    set({ projects, projectsTree })
  },

  getProjectById: (id) => {
    return get().projects.find((p) => p.id === id)
  },

  buildProjectTree: (projects) => {
    const projectMap = new Map<string, ProjectWithChildren>()
    const rootProjects: ProjectWithChildren[] = []

    // First pass: create all projects
    projects.forEach((project) => {
      projectMap.set(project.id, { ...project, children: [] })
    })

    // Second pass: build hierarchy
    projects.forEach((project) => {
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
      projects.forEach((p) => {
        if (p.children && p.children.length > 0) {
          sortProjects(p.children)
        }
      })
    }

    sortProjects(rootProjects)
    return rootProjects
  },

  clearError: () => set({ error: null })
}))
