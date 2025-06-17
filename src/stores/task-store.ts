import { create } from 'zustand'
import { createClient } from '@/lib/supabase/client'
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
  
  // Actions
  fetchTasks: () => Promise<void>
  createTask: (task: TaskCreateData) => Promise<void>
  updateTask: (id: string, updates: Partial<Task>) => Promise<void>
  updateTaskTags: (id: string, tagIds: string[]) => Promise<void>
  deleteTask: (id: string) => Promise<void>
  toggleTask: (id: string) => Promise<void>
  selectTask: (id: string | null) => void
}

export const useTaskStore = create<TaskStore>((set, get) => ({
  tasks: [],
  isLoading: false,
  selectedTaskId: null,

  fetchTasks: async () => {
    set({ isLoading: true })
    const supabase = createClient()
    
    // Get current date for filtering deferred tasks
    const now = new Date().toISOString()
    
    const { data: tasks, error: tasksError } = await supabase
      .from('tasks')
      .select('*')
      .eq('status', 'active')
      .or(`defer_date.is.null,defer_date.lte.${now}`)
      .order('position')
    
    if (tasksError) {
      console.error('Error fetching tasks:', tasksError)
      set({ isLoading: false })
      return
    }

    // Fetch tags for all tasks
    const { data: taskTags, error: tagsError } = await supabase
      .from('task_tags')
      .select('task_id, tag_id')
      .in('task_id', tasks?.map(t => t.id) || [])

    if (!tagsError && tasks) {
      // Group tags by task
      const tagsByTask = taskTags?.reduce((acc, tt) => {
        if (!acc[tt.task_id]) acc[tt.task_id] = []
        acc[tt.task_id].push(tt.tag_id)
        return acc
      }, {} as Record<string, string[]>) || {}

      // Merge tags into tasks
      const tasksWithTags = tasks.map(task => ({
        ...task,
        tags: tagsByTask[task.id] || []
      }))

      set({ tasks: tasksWithTags, isLoading: false })
    } else {
      console.error('Error fetching task tags:', tagsError)
      set({ isLoading: false })
    }
  },

  createTask: async (taskData) => {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) return
    
    const { tagIds, ...taskInsertData } = taskData
    
    const { data: task, error: taskError } = await supabase
      .from('tasks')
      .insert({
        ...taskInsertData,
        user_id: user.id,
        title: taskInsertData.title || 'New Task',
      })
      .select()
      .single()
    
    if (taskError || !task) {
      console.error('Error creating task:', taskError)
      return
    }

    // Add tags if provided
    if (tagIds && tagIds.length > 0) {
      const tagInserts = tagIds.map(tagId => ({
        task_id: task.id,
        tag_id: tagId
      }))

      const { error: tagsError } = await supabase
        .from('task_tags')
        .insert(tagInserts)

      if (tagsError) {
        console.error('Error adding tags:', tagsError)
      }
    }

    const taskWithTags = { ...task, tags: tagIds || [] }
    set(state => ({ tasks: [...state.tasks, taskWithTags] }))
  },

  updateTask: async (id, updates) => {
    const supabase = createClient()
    
    const { error } = await supabase
      .from('tasks')
      .update(updates)
      .eq('id', id)
    
    if (!error) {
      set(state => ({
        tasks: state.tasks.map(task => 
          task.id === id ? { ...task, ...updates } : task
        )
      }))
    }
  },

  deleteTask: async (id) => {
    const supabase = createClient()
    
    const { error } = await supabase
      .from('tasks')
      .delete()
      .eq('id', id)
    
    if (!error) {
      set(state => ({
        tasks: state.tasks.filter(task => task.id !== id)
      }))
    }
  },

  toggleTask: async (id) => {
    const task = get().tasks.find(t => t.id === id)
    if (!task) return
    
    await get().updateTask(id, {
      status: task.status === 'active' ? 'completed' : 'active',
      completed_at: task.status === 'active' ? new Date().toISOString() : null
    })
  },

  updateTaskTags: async (id, tagIds) => {
    const supabase = createClient()
    
    // First delete existing tags
    const { error: deleteError } = await supabase
      .from('task_tags')
      .delete()
      .eq('task_id', id)
    
    if (deleteError) {
      console.error('Error deleting existing tags:', deleteError)
      return
    }

    // Then add new tags
    if (tagIds.length > 0) {
      const tagInserts = tagIds.map(tagId => ({
        task_id: id,
        tag_id: tagId
      }))

      const { error: insertError } = await supabase
        .from('task_tags')
        .insert(tagInserts)

      if (insertError) {
        console.error('Error adding tags:', insertError)
        return
      }
    }

    // Update local state
    set(state => ({
      tasks: state.tasks.map(task => 
        task.id === id ? { ...task, tags: tagIds } : task
      )
    }))
  },

  selectTask: (id) => set({ selectedTaskId: id })
}))