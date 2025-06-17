import type { Database } from '@/types/database.types'

type Task = Database['public']['Tables']['tasks']['Row']
type Project = Database['public']['Tables']['projects']['Row']
type Tag = Database['public']['Tables']['tags']['Row']

export const mockTask: Task = {
  id: '1',
  user_id: 'user-1',
  project_id: null,
  title: 'Test Task',
  note: null,
  status: 'active',
  due_date: null,
  defer_date: null,
  completed_at: null,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  position: 0,
  estimated_minutes: null,
  repeat_interval: null,
  repeat_unit: null,
  time_of_day: null,
  location: null,
  energy_required: null
}

export const mockProject: Project = {
  id: '1',
  user_id: 'user-1',
  name: 'Test Project',
  description: null,
  color: '#3B82F6',
  parent_id: null,
  status: 'active',
  order: 0,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString()
}

export const mockTag: Tag = {
  id: '1',
  user_id: 'user-1',
  name: 'important',
  color: '#EF4444',
  icon: null,
  parent_id: null,
  position: 0,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString()
}

export const mockSupabaseClient = {
  auth: {
    getUser: jest.fn().mockResolvedValue({
      data: {
        user: {
          id: 'user-1',
          email: 'test@example.com'
        }
      },
      error: null
    }),
    signIn: jest.fn().mockResolvedValue({ data: {}, error: null }),
    signOut: jest.fn().mockResolvedValue({ error: null }),
    onAuthStateChange: jest.fn(() => ({
      data: { subscription: { unsubscribe: jest.fn() } }
    }))
  },
  from: jest.fn((table: string) => ({
    select: jest.fn().mockReturnThis(),
    insert: jest.fn().mockReturnThis(),
    update: jest.fn().mockReturnThis(),
    delete: jest.fn().mockReturnThis(),
    eq: jest.fn().mockReturnThis(),
    in: jest.fn().mockReturnThis(),
    order: jest.fn().mockReturnThis(),
    single: jest.fn().mockResolvedValue({ data: null, error: null }),
    then: jest.fn().mockResolvedValue({ data: [], error: null })
  }))
}

export const createMockStore = <T extends Record<string, any>>(
  initialState: T
) => {
  let state = initialState
  const listeners = new Set<() => void>()

  return {
    getState: () => state,
    setState: (partial: Partial<T> | ((state: T) => Partial<T>)) => {
      const updates = typeof partial === 'function' ? partial(state) : partial
      state = { ...state, ...updates }
      listeners.forEach(listener => listener())
    },
    subscribe: (listener: () => void) => {
      listeners.add(listener)
      return () => listeners.delete(listener)
    },
    destroy: () => listeners.clear()
  }
}