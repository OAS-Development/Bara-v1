import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { api, isApiError, getAuthUser, type ApiError } from '@/lib/api/client'

export interface Habit {
  id: string
  user_id: string
  name: string
  description?: string
  frequency: 'daily' | 'weekly' | 'monthly'
  target_count: number
  color?: string
  icon?: string
  active: boolean
  created_at: string
  updated_at: string
}

export interface HabitCompletion {
  id: string
  habit_id: string
  completed_at: string
  notes?: string
  created_at: string
}

interface HabitStore {
  habits: Habit[]
  completions: HabitCompletion[]
  loading: boolean
  error: ApiError | null

  // Actions
  fetchHabits: () => Promise<void>
  fetchCompletions: (days?: number) => Promise<void>
  addHabit: (habit: Omit<Habit, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => Promise<void>
  updateHabit: (id: string, updates: Partial<Habit>) => Promise<void>
  deleteHabit: (id: string) => Promise<void>
  toggleHabitActive: (id: string) => Promise<void>
  recordCompletion: (habitId: string, notes?: string) => Promise<void>
  removeCompletion: (completionId: string) => Promise<void>

  // Computed
  getStreak: (habitId: string) => number
  getCompletionsForDate: (date: Date) => HabitCompletion[]
  getHabitCompletionsForDate: (habitId: string, date: Date) => HabitCompletion[]
  isHabitCompletedForDate: (habitId: string, date: Date) => boolean
  
  // Error management
  clearError: () => void
}

export const useHabitStore = create<HabitStore>()(
  devtools(
    (set, get) => ({
      habits: [],
      completions: [],
      loading: false,
      error: null,

      fetchHabits: async () => {
        set({ loading: true, error: null })
        
        const result = await api.query(
          () => api.client
            .from('habits')
            .select('*')
            .order('created_at', { ascending: false }),
          { errorContext: 'Failed to fetch habits' }
        )

        if (isApiError(result)) {
          set({ loading: false, error: result.error })
          return
        }

        set({ habits: result.data, loading: false })
      },

      fetchCompletions: async (days: number = 30) => {
        set({ loading: true, error: null })
        
        const startDate = new Date()
        startDate.setDate(startDate.getDate() - days)

        const result = await api.query(
          () => api.client
            .from('habit_completions')
            .select('*')
            .gte('completed_at', startDate.toISOString())
            .order('completed_at', { ascending: false }),
          { errorContext: 'Failed to fetch habit completions' }
        )

        if (isApiError(result)) {
          set({ loading: false, error: result.error })
          return
        }

        set({ completions: result.data, loading: false })
      },

      addHabit: async (habit) => {
        set({ loading: true, error: null })
        
        const userResult = await getAuthUser()

        if (!userResult.data || !userResult.data.user) {
          set({ loading: false, error: userResult.error || { message: 'Not authenticated' } })
          return
        }

        const result = await api.mutate(
          () => api.client
            .from('habits')
            .insert({
              ...habit,
              user_id: userResult.data.user.id
            })
            .select()
            .single(),
          { 
            successMessage: 'Habit created successfully',
            errorContext: 'Failed to create habit' 
          }
        )

        if (isApiError(result)) {
          set({ loading: false, error: result.error })
          return
        }

        if (result.data) {
          const newHabit = result.data
          set((state) => ({
            habits: [newHabit, ...state.habits],
            loading: false
          }))
        }
      },

      updateHabit: async (id, updates) => {
        set({ loading: true, error: null })
        
        const result = await api.mutate(
          () => api.client
            .from('habits')
            .update({
              ...updates,
              updated_at: new Date().toISOString()
            })
            .eq('id', id)
            .select()
            .single(),
          { 
            successMessage: 'Habit updated successfully',
            errorContext: 'Failed to update habit' 
          }
        )

        if (isApiError(result)) {
          set({ loading: false, error: result.error })
          return
        }

        if (result.data) {
          const updatedHabit = result.data
          set((state) => ({
            habits: state.habits.map((h) => (h.id === id ? updatedHabit : h)),
            loading: false
          }))
        }
      },

      deleteHabit: async (id) => {
        set({ loading: true, error: null })
        
        const result = await api.mutate(
          () => api.client.from('habits').delete().eq('id', id),
          { 
            successMessage: 'Habit deleted successfully',
            errorContext: 'Failed to delete habit' 
          }
        )

        if (isApiError(result)) {
          set({ loading: false, error: result.error })
          return
        }

        set((state) => ({
          habits: state.habits.filter((h) => h.id !== id),
          completions: state.completions.filter((c) => c.habit_id !== id),
          loading: false
        }))
      },

      toggleHabitActive: async (id) => {
        const habit = get().habits.find((h) => h.id === id)
        if (habit) {
          await get().updateHabit(id, { active: !habit.active })
        }
      },

      recordCompletion: async (habitId, notes) => {
        set({ loading: true, error: null })
        
        const result = await api.mutate(
          () => api.client
            .from('habit_completions')
            .insert({
              habit_id: habitId,
              notes
            })
            .select()
            .single(),
          { 
            successMessage: 'Habit completion recorded',
            errorContext: 'Failed to record habit completion' 
          }
        )

        if (isApiError(result)) {
          set({ loading: false, error: result.error })
          return
        }

        if (result.data) {
          const newCompletion = result.data
          set((state) => ({
            completions: [newCompletion, ...state.completions],
            loading: false
          }))
        }
      },

      removeCompletion: async (completionId) => {
        set({ loading: true, error: null })
        
        const result = await api.mutate(
          () => api.client.from('habit_completions').delete().eq('id', completionId),
          { 
            successMessage: 'Habit completion removed',
            errorContext: 'Failed to remove habit completion' 
          }
        )

        if (isApiError(result)) {
          set({ loading: false, error: result.error })
          return
        }

        set((state) => ({
          completions: state.completions.filter((c) => c.id !== completionId),
          loading: false
        }))
      },

      getStreak: (habitId) => {
        const completions = get()
          .completions.filter((c) => c.habit_id === habitId)
          .sort((a, b) => new Date(b.completed_at).getTime() - new Date(a.completed_at).getTime())

        if (completions.length === 0) return 0

        let streak = 0
        let currentDate = new Date()
        currentDate.setHours(0, 0, 0, 0)

        for (const completion of completions) {
          const completionDate = new Date(completion.completed_at)
          completionDate.setHours(0, 0, 0, 0)

          if (completionDate.getTime() === currentDate.getTime()) {
            streak++
            currentDate.setDate(currentDate.getDate() - 1)
          } else if (completionDate.getTime() < currentDate.getTime()) {
            break
          }
        }

        return streak
      },

      getCompletionsForDate: (date) => {
        const startOfDay = new Date(date)
        startOfDay.setHours(0, 0, 0, 0)
        const endOfDay = new Date(date)
        endOfDay.setHours(23, 59, 59, 999)

        return get().completions.filter((c) => {
          const completionDate = new Date(c.completed_at)
          return completionDate >= startOfDay && completionDate <= endOfDay
        })
      },

      getHabitCompletionsForDate: (habitId, date) => {
        return get()
          .getCompletionsForDate(date)
          .filter((c) => c.habit_id === habitId)
      },

      isHabitCompletedForDate: (habitId, date) => {
        return get().getHabitCompletionsForDate(habitId, date).length > 0
      },
      
      clearError: () => set({ error: null })
    }),
    { name: 'habit-store' }
  )
)
