import { create } from 'zustand'
import { createClient } from '@/lib/supabase/client'
import type { Database } from '@/types/database.types'

type Task = Database['public']['Tables']['tasks']['Row']
type TaskInsert = Database['public']['Tables']['tasks']['Insert']

interface TaskStore {
  tasks: Task[]
  isLoading: boolean
  selectedTaskId: string | null
  
  // Actions
  fetchTasks: () => Promise<void>
  createTask: (task: Partial<TaskInsert>) => Promise<void>
  updateTask: (id: string, updates: Partial<Task>) => Promise<void>
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
    
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('status', 'active')
      .order('position')
    
    if (!error && data) {
      set({ tasks: data, isLoading: false })
    } else {
      console.error('Error fetching tasks:', error)
      set({ isLoading: false })
    }
  },

  createTask: async (taskData) => {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) return
    
    const { data, error } = await supabase
      .from('tasks')
      .insert({
        ...taskData,
        user_id: user.id,
        title: taskData.title || 'New Task',
      })
      .select()
      .single()
    
    if (!error && data) {
      set(state => ({ tasks: [...state.tasks, data] }))
    }
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

  selectTask: (id) => set({ selectedTaskId: id })
}))