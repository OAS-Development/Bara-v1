import { create } from 'zustand'
import { api, isApiError, type ApiError } from '@/lib/api/client'
import type { Database } from '@/types/database.types'

type Task = Database['public']['Tables']['tasks']['Row']
type TaskInsert = Database['public']['Tables']['tasks']['Insert']

interface TaskWithTags extends Task {
  tags?: string[]
}

interface TaskCreateData extends Partial<TaskInsert> {
  tagIds?: string[]
}

interface TaskStore {
  tasks: TaskWithTags[]
  isLoading: boolean
  selectedTaskId: string | null
  error: ApiError | null

  // Actions
  fetchTasks: () => Promise<void>
  createTask: (task: TaskCreateData) => Promise<void>
  updateTask: (id: string, updates: Partial<Task>) => Promise<void>
  updateTaskTags: (id: string, tagIds: string[]) => Promise<void>
  deleteTask: (id: string) => Promise<void>
  toggleTask: (id: string) => Promise<void>
  selectTask: (id: string | null) => void
  clearError: () => void
}

export const useTaskStore = create<TaskStore>((set, get) => ({
  tasks: [],
  isLoading: false,
  selectedTaskId: null,
  error: null,

  fetchTasks: async () => {
    set({ isLoading: true, error: null })

    // Get current date for filtering deferred tasks
    const now = new Date().toISOString()

    const tasksResult = await api.query(
      () => api.client
        .from('tasks')
        .select('*')
        .eq('status', 'active')
        .or(`defer_date.is.null,defer_date.lte.${now}`)
        .order('position'),
      { errorContext: 'Failed to fetch tasks' }
    )

    if (isApiError(tasksResult)) {
      set({ isLoading: false, error: tasksResult.error })
      return
    }

    const tasks = tasksResult.data

    // Fetch tags for all tasks
    const tagsResult = await api.query(
      () => api.client
        .from('task_tags')
        .select('task_id, tag_id')
        .in('task_id', tasks.map((t) => t.id)),
      { errorContext: 'Failed to fetch task tags' }
    )

    if (isApiError(tagsResult)) {
      set({ isLoading: false, error: tagsResult.error })
      return
    }

    // Group tags by task
    const tagsByTask = tagsResult.data.reduce(
      (acc, tt) => {
        if (!acc[tt.task_id]) acc[tt.task_id] = []
        acc[tt.task_id].push(tt.tag_id)
        return acc
      },
      {} as Record<string, string[]>
    )

    // Merge tags into tasks
    const tasksWithTags = tasks.map((task) => ({
      ...task,
      tags: tagsByTask[task.id] || []
    }))

    set({ tasks: tasksWithTags, isLoading: false, error: null })
  },

  createTask: async (taskData) => {
    set({ error: null })
    
    const userResult = await api.query(
      () => api.client.auth.getUser(),
      { showToast: false }
    )

    if (isApiError(userResult) || !userResult.data.user) {
      set({ error: { message: 'No authenticated user' } })
      return
    }

    const { tagIds, ...taskInsertData } = taskData

    const taskResult = await api.mutate(
      () => api.client
        .from('tasks')
        .insert({
          ...taskInsertData,
          user_id: userResult.data.user.id,
          title: taskInsertData.title || 'New Task'
        })
        .select()
        .single(),
      { 
        successMessage: 'Task created successfully',
        errorContext: 'Failed to create task' 
      }
    )

    if (isApiError(taskResult)) {
      set({ error: taskResult.error })
      return
    }

    const task = taskResult.data

    // Add tags if provided
    if (tagIds && tagIds.length > 0) {
      const tagInserts = tagIds.map((tagId) => ({
        task_id: task.id,
        tag_id: tagId
      }))

      const tagsResult = await api.mutate(
        () => api.client.from('task_tags').insert(tagInserts),
        { 
          showToast: false,
          errorContext: 'Failed to add tags' 
        }
      )

      if (isApiError(tagsResult)) {
        set({ error: tagsResult.error })
      }
    }

    const taskWithTags = { ...task, tags: tagIds || [] }
    set((state) => ({ tasks: [...state.tasks, taskWithTags] }))
  },

  updateTask: async (id, updates) => {
    set({ error: null })
    
    const result = await api.mutate(
      () => api.client.from('tasks').update(updates).eq('id', id),
      { 
        successMessage: 'Task updated successfully',
        errorContext: 'Failed to update task' 
      }
    )

    if (isApiError(result)) {
      set({ error: result.error })
      return
    }

    set((state) => ({
      tasks: state.tasks.map((task) => (task.id === id ? { ...task, ...updates } : task))
    }))
  },

  deleteTask: async (id) => {
    set({ error: null })
    
    const result = await api.mutate(
      () => api.client.from('tasks').delete().eq('id', id),
      { 
        successMessage: 'Task deleted successfully',
        errorContext: 'Failed to delete task' 
      }
    )

    if (isApiError(result)) {
      set({ error: result.error })
      return
    }

    set((state) => ({
      tasks: state.tasks.filter((task) => task.id !== id)
    }))
  },

  toggleTask: async (id) => {
    const task = get().tasks.find((t) => t.id === id)
    if (!task) return

    await get().updateTask(id, {
      status: task.status === 'active' ? 'completed' : 'active',
      completed_at: task.status === 'active' ? new Date().toISOString() : null
    })
  },

  updateTaskTags: async (id, tagIds) => {
    set({ error: null })
    
    // First delete existing tags
    const deleteResult = await api.mutate(
      () => api.client.from('task_tags').delete().eq('task_id', id),
      { 
        showToast: false,
        errorContext: 'Failed to delete existing tags' 
      }
    )

    if (isApiError(deleteResult)) {
      set({ error: deleteResult.error })
      return
    }

    // Then add new tags
    if (tagIds.length > 0) {
      const tagInserts = tagIds.map((tagId) => ({
        task_id: id,
        tag_id: tagId
      }))

      const insertResult = await api.mutate(
        () => api.client.from('task_tags').insert(tagInserts),
        { 
          successMessage: 'Tags updated successfully',
          errorContext: 'Failed to add tags' 
        }
      )

      if (isApiError(insertResult)) {
        set({ error: insertResult.error })
        return
      }
    }

    // Update local state
    set((state) => ({
      tasks: state.tasks.map((task) => (task.id === id ? { ...task, tags: tagIds } : task))
    }))
  },

  selectTask: (id) => set({ selectedTaskId: id }),

  clearError: () => set({ error: null })
}))
