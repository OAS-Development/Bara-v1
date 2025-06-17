import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { api, isApiError, type ApiError } from '@/lib/api/client'

export interface Goal {
  id: string
  user_id: string
  title: string
  description?: string
  category?: 'health' | 'finance' | 'career' | 'personal' | 'relationships' | 'learning'
  target_date?: string
  status: 'active' | 'paused' | 'completed' | 'abandoned'
  progress: number
  created_at: string
  updated_at: string
  completed_at?: string
}

export interface GoalMilestone {
  id: string
  goal_id: string
  title: string
  description?: string
  target_date?: string
  completed: boolean
  completed_at?: string
  order_index: number
  created_at: string
  updated_at: string
}

interface GoalsStore {
  goals: Goal[]
  milestones: GoalMilestone[]
  loading: boolean
  error: ApiError | null

  // Goal actions
  fetchGoals: (status?: Goal['status']) => Promise<void>
  addGoal: (goal: Omit<Goal, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => Promise<void>
  updateGoal: (id: string, updates: Partial<Goal>) => Promise<void>
  deleteGoal: (id: string) => Promise<void>
  updateProgress: (id: string, progress: number) => Promise<void>
  completeGoal: (id: string) => Promise<void>

  // Milestone actions
  fetchMilestones: (goalId?: string) => Promise<void>
  addMilestone: (
    milestone: Omit<GoalMilestone, 'id' | 'created_at' | 'updated_at'>
  ) => Promise<void>
  updateMilestone: (id: string, updates: Partial<GoalMilestone>) => Promise<void>
  deleteMilestone: (id: string) => Promise<void>
  toggleMilestone: (id: string) => Promise<void>
  reorderMilestones: (goalId: string, milestoneIds: string[]) => Promise<void>

  // Computed
  getGoalsByCategory: (category: Goal['category']) => Goal[]
  getGoalMilestones: (goalId: string) => GoalMilestone[]
  calculateGoalProgress: (goalId: string) => number
  
  // Error management
  clearError: () => void
}

export const useGoalsStore = create<GoalsStore>()(
  devtools(
    (set, get) => ({
      goals: [],
      milestones: [],
      loading: false,
      error: null,

      // Goal actions
      fetchGoals: async (status?: Goal['status']) => {
        set({ loading: true, error: null })
        
        const result = await api.query(
          () => {
            let query = api.client.from('goals').select('*').order('created_at', { ascending: false })

            if (status) {
              query = query.eq('status', status)
            }

            return query
          },
          { errorContext: 'Failed to fetch goals' }
        )

        if (isApiError(result)) {
          set({ loading: false, error: result.error })
          return
        }

        set({ goals: result.data, loading: false })
      },

      addGoal: async (goal) => {
        set({ loading: true, error: null })
        
        const userResult = await api.query(
          () => api.client.auth.getUser(),
          { showToast: false }
        )

        if (isApiError(userResult) || !userResult.data.user) {
          set({ loading: false, error: { message: 'Not authenticated' } })
          return
        }

        const result = await api.mutate(
          () => api.client
            .from('goals')
            .insert({
              ...goal,
              user_id: userResult.data.user.id
            })
            .select()
            .single(),
          { 
            successMessage: 'Goal created successfully',
            errorContext: 'Failed to create goal' 
          }
        )

        if (isApiError(result)) {
          set({ loading: false, error: result.error })
          return
        }

        set((state) => ({
          goals: [result.data, ...state.goals],
          loading: false
        }))
      },

      updateGoal: async (id, updates) => {
        set({ loading: true, error: null })
        
        const result = await api.mutate(
          () => api.client
            .from('goals')
            .update({
              ...updates,
              updated_at: new Date().toISOString()
            })
            .eq('id', id)
            .select()
            .single(),
          { 
            successMessage: 'Goal updated successfully',
            errorContext: 'Failed to update goal' 
          }
        )

        if (isApiError(result)) {
          set({ loading: false, error: result.error })
          return
        }

        set((state) => ({
          goals: state.goals.map((g) => (g.id === id ? result.data : g)),
          loading: false
        }))
      },

      deleteGoal: async (id) => {
        set({ loading: true, error: null })
        
        const result = await api.mutate(
          () => api.client.from('goals').delete().eq('id', id),
          { 
            successMessage: 'Goal deleted successfully',
            errorContext: 'Failed to delete goal' 
          }
        )

        if (isApiError(result)) {
          set({ loading: false, error: result.error })
          return
        }

        set((state) => ({
          goals: state.goals.filter((g) => g.id !== id),
          milestones: state.milestones.filter((m) => m.goal_id !== id),
          loading: false
        }))
      },

      updateProgress: async (id, progress) => {
        await get().updateGoal(id, { progress })
      },

      completeGoal: async (id) => {
        await get().updateGoal(id, {
          status: 'completed',
          progress: 100,
          completed_at: new Date().toISOString()
        })
      },

      // Milestone actions
      fetchMilestones: async (goalId?: string) => {
        set({ loading: true, error: null })
        
        let queryBuilder = () => {
          let query = api.client.from('goal_milestones').select('*').order('order_index')

          if (goalId) {
            query = query.eq('goal_id', goalId)
          }

          return query
        }

        const result = await api.query(
          queryBuilder,
          { errorContext: 'Failed to fetch milestones' }
        )

        if (isApiError(result)) {
          set({ loading: false, error: result.error })
          return
        }

        set({ milestones: result.data, loading: false })
      },

      addMilestone: async (milestone) => {
        set({ loading: true, error: null })
        
        const result = await api.mutate(
          () => api.client
            .from('goal_milestones')
            .insert(milestone)
            .select()
            .single(),
          { 
            successMessage: 'Milestone added successfully',
            errorContext: 'Failed to add milestone' 
          }
        )

        if (isApiError(result)) {
          set({ loading: false, error: result.error })
          return
        }

        set((state) => ({
          milestones: [...state.milestones, result.data],
          loading: false
        }))

        // Update goal progress
        get().calculateGoalProgress(milestone.goal_id)
      },

      updateMilestone: async (id, updates) => {
        set({ loading: true, error: null })
        
        const result = await api.mutate(
          () => api.client
            .from('goal_milestones')
            .update({
              ...updates,
              updated_at: new Date().toISOString()
            })
            .eq('id', id)
            .select()
            .single(),
          { 
            successMessage: 'Milestone updated successfully',
            errorContext: 'Failed to update milestone' 
          }
        )

        if (isApiError(result)) {
          set({ loading: false, error: result.error })
          return
        }

        set((state) => ({
          milestones: state.milestones.map((m) => (m.id === id ? result.data : m)),
          loading: false
        }))

        // Update goal progress if completion status changed
        if ('completed' in updates) {
          const milestone = get().milestones.find((m) => m.id === id)
          if (milestone) {
            const progress = get().calculateGoalProgress(milestone.goal_id)
            await get().updateProgress(milestone.goal_id, progress)
          }
        }
      },

      deleteMilestone: async (id) => {
        set({ loading: true, error: null })
        
        const milestone = get().milestones.find((m) => m.id === id)

        const result = await api.mutate(
          () => api.client.from('goal_milestones').delete().eq('id', id),
          { 
            successMessage: 'Milestone deleted successfully',
            errorContext: 'Failed to delete milestone' 
          }
        )

        if (isApiError(result)) {
          set({ loading: false, error: result.error })
          return
        }

        set((state) => ({
          milestones: state.milestones.filter((m) => m.id !== id),
          loading: false
        }))

        // Update goal progress
        if (milestone) {
          const progress = get().calculateGoalProgress(milestone.goal_id)
          await get().updateProgress(milestone.goal_id, progress)
        }
      },

      toggleMilestone: async (id) => {
        const milestone = get().milestones.find((m) => m.id === id)
        if (milestone) {
          await get().updateMilestone(id, {
            completed: !milestone.completed,
            completed_at: !milestone.completed ? new Date().toISOString() : undefined
          })
        }
      },

      reorderMilestones: async (goalId, milestoneIds) => {
        set({ loading: true, error: null })
        
        const updates = milestoneIds.map((id, index) => ({
          id,
          order_index: index
        }))

        // Update each milestone's order
        for (const update of updates) {
          const result = await api.mutate(
            () => api.client
              .from('goal_milestones')
              .update({ order_index: update.order_index })
              .eq('id', update.id),
            { showToast: false }
          )

          if (isApiError(result)) {
            set({ loading: false, error: result.error })
            return
          }
        }

        // Refresh milestones
        await get().fetchMilestones(goalId)

        set({ loading: false })
      },

      // Computed
      getGoalsByCategory: (category) => {
        return get().goals.filter((g) => g.category === category)
      },

      getGoalMilestones: (goalId) => {
        return get()
          .milestones.filter((m) => m.goal_id === goalId)
          .sort((a, b) => a.order_index - b.order_index)
      },

      calculateGoalProgress: (goalId) => {
        const milestones = get().getGoalMilestones(goalId)
        if (milestones.length === 0) return 0

        const completed = milestones.filter((m) => m.completed).length
        return Math.round((completed / milestones.length) * 100)
      },
      
      clearError: () => set({ error: null })
    }),
    { name: 'goals-store' }
  )
)
