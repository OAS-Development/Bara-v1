import { create } from 'zustand'
import { api, isApiError, type ApiError } from '@/lib/api/client'
import { Database } from '@/types/database.types'

type Perspective = Database['public']['Tables']['perspectives']['Row']
type PerspectiveInsert = Database['public']['Tables']['perspectives']['Insert']
type PerspectiveUpdate = Database['public']['Tables']['perspectives']['Update']

interface PerspectiveState {
  perspectives: Perspective[]
  loading: boolean
  error: ApiError | null

  fetchPerspectives: () => Promise<void>
  createPerspective: (perspective: PerspectiveInsert) => Promise<Perspective | null>
  updatePerspective: (id: string, update: PerspectiveUpdate) => Promise<void>
  deletePerspective: (id: string) => Promise<void>
  getPerspectiveById: (id: string) => Perspective | undefined
  clearError: () => void
}

export const usePerspectiveStore = create<PerspectiveState>((set, get) => ({
  perspectives: [],
  loading: false,
  error: null,

  fetchPerspectives: async () => {
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
        .from('perspectives')
        .select('*')
        .eq('user_id', userResult.data.user.id)
        .order('position', { ascending: true }),
      { errorContext: 'Failed to fetch perspectives' }
    )

    if (isApiError(result)) {
      set({ loading: false, error: result.error })
      return
    }

    set({ perspectives: result.data, loading: false, error: null })
  },

  createPerspective: async (perspective) => {
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
        .from('perspectives')
        .insert({ ...perspective, user_id: userResult.data.user.id })
        .select()
        .single(),
      { 
        successMessage: 'Perspective created successfully',
        errorContext: 'Failed to create perspective' 
      }
    )

    if (isApiError(result)) {
      set({ error: result.error })
      return null
    }

    set((state) => ({ perspectives: [...state.perspectives, result.data] }))
    return result.data
  },

  updatePerspective: async (id, update) => {
    set({ error: null })
    
    const result = await api.mutate(
      () => api.client.from('perspectives').update(update).eq('id', id),
      { 
        successMessage: 'Perspective updated successfully',
        errorContext: 'Failed to update perspective' 
      }
    )

    if (isApiError(result)) {
      set({ error: result.error })
      return
    }

    set((state) => ({
      perspectives: state.perspectives.map((p) => (p.id === id ? { ...p, ...update } : p))
    }))
  },

  deletePerspective: async (id) => {
    set({ error: null })
    
    const result = await api.mutate(
      () => api.client.from('perspectives').delete().eq('id', id),
      { 
        successMessage: 'Perspective deleted successfully',
        errorContext: 'Failed to delete perspective' 
      }
    )

    if (isApiError(result)) {
      set({ error: result.error })
      return
    }

    set((state) => ({
      perspectives: state.perspectives.filter((p) => p.id !== id)
    }))
  },

  getPerspectiveById: (id) => {
    return get().perspectives.find((p) => p.id === id)
  },

  clearError: () => set({ error: null })
}))
