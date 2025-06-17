import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { api, isApiError, type ApiError } from '@/lib/api/client'

export type MetricType =
  | 'weight'
  | 'sleep_hours'
  | 'steps'
  | 'heart_rate'
  | 'blood_pressure_systolic'
  | 'blood_pressure_diastolic'
  | 'calories'
  | 'water_intake'
  | 'exercise_minutes'

export interface HealthMetric {
  id: string
  user_id: string
  metric_type: MetricType
  value: number
  unit: string
  recorded_at: string
  notes?: string
  created_at: string
}

interface HealthStore {
  metrics: HealthMetric[]
  loading: boolean
  error: ApiError | null

  // Actions
  fetchMetrics: (type?: MetricType, days?: number) => Promise<void>
  addMetric: (metric: Omit<HealthMetric, 'id' | 'user_id' | 'created_at'>) => Promise<void>
  updateMetric: (id: string, updates: Partial<HealthMetric>) => Promise<void>
  deleteMetric: (id: string) => Promise<void>
  getLatestMetric: (type: MetricType) => HealthMetric | undefined
  getMetricsByDateRange: (type: MetricType, startDate: Date, endDate: Date) => HealthMetric[]
  
  // Error management
  clearError: () => void
}

export const useHealthStore = create<HealthStore>()(
  devtools(
    (set, get) => ({
      metrics: [],
      loading: false,
      error: null,

      fetchMetrics: async (type?: MetricType, days: number = 30) => {
        set({ loading: true, error: null })
        
        const startDate = new Date()
        startDate.setDate(startDate.getDate() - days)

        let queryBuilder = () => {
          let query = api.client
            .from('health_metrics')
            .select('*')
            .gte('recorded_at', startDate.toISOString())
            .order('recorded_at', { ascending: false })

          if (type) {
            query = query.eq('metric_type', type)
          }

          return query
        }

        const result = await api.query(
          queryBuilder,
          { errorContext: 'Failed to fetch health metrics' }
        )

        if (isApiError(result)) {
          set({ loading: false, error: result.error })
          return
        }

        set({ metrics: result.data, loading: false })
      },

      addMetric: async (metric) => {
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
            .from('health_metrics')
            .insert({
              ...metric,
              user_id: userResult.data.user.id
            })
            .select()
            .single(),
          { 
            successMessage: 'Health metric recorded successfully',
            errorContext: 'Failed to record health metric' 
          }
        )

        if (isApiError(result)) {
          set({ loading: false, error: result.error })
          return
        }

        set((state) => ({
          metrics: [result.data, ...state.metrics],
          loading: false
        }))
      },

      updateMetric: async (id, updates) => {
        set({ loading: true, error: null })
        
        const result = await api.mutate(
          () => api.client
            .from('health_metrics')
            .update(updates)
            .eq('id', id)
            .select()
            .single(),
          { 
            successMessage: 'Health metric updated successfully',
            errorContext: 'Failed to update health metric' 
          }
        )

        if (isApiError(result)) {
          set({ loading: false, error: result.error })
          return
        }

        set((state) => ({
          metrics: state.metrics.map((m) => (m.id === id ? result.data : m)),
          loading: false
        }))
      },

      deleteMetric: async (id) => {
        set({ loading: true, error: null })
        
        const result = await api.mutate(
          () => api.client.from('health_metrics').delete().eq('id', id),
          { 
            successMessage: 'Health metric deleted successfully',
            errorContext: 'Failed to delete health metric' 
          }
        )

        if (isApiError(result)) {
          set({ loading: false, error: result.error })
          return
        }

        set((state) => ({
          metrics: state.metrics.filter((m) => m.id !== id),
          loading: false
        }))
      },

      getLatestMetric: (type: MetricType) => {
        const metrics = get().metrics
        return metrics
          .filter((m) => m.metric_type === type)
          .sort((a, b) => new Date(b.recorded_at).getTime() - new Date(a.recorded_at).getTime())[0]
      },

      getMetricsByDateRange: (type: MetricType, startDate: Date, endDate: Date) => {
        const metrics = get().metrics
        return metrics
          .filter((m) => {
            const date = new Date(m.recorded_at)
            return m.metric_type === type && date >= startDate && date <= endDate
          })
          .sort((a, b) => new Date(a.recorded_at).getTime() - new Date(b.recorded_at).getTime())
      },
      
      clearError: () => set({ error: null })
    }),
    { name: 'health-store' }
  )
)
