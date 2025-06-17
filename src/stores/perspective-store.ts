import { create } from 'zustand'
import { createClient } from '@/lib/supabase/client'
import { Database } from '@/types/database.types'

type Perspective = Database['public']['Tables']['perspectives']['Row']
type PerspectiveInsert = Database['public']['Tables']['perspectives']['Insert']
type PerspectiveUpdate = Database['public']['Tables']['perspectives']['Update']

interface PerspectiveState {
  perspectives: Perspective[]
  loading: boolean
  error: string | null
  
  fetchPerspectives: () => Promise<void>
  createPerspective: (perspective: PerspectiveInsert) => Promise<Perspective | null>
  updatePerspective: (id: string, update: PerspectiveUpdate) => Promise<void>
  deletePerspective: (id: string) => Promise<void>
  getPerspectiveById: (id: string) => Perspective | undefined
}

const supabase = createClient()

export const usePerspectiveStore = create<PerspectiveState>((set, get) => ({
  perspectives: [],
  loading: false,
  error: null,

  fetchPerspectives: async () => {
    set({ loading: true })
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('No authenticated user')

      const { data, error } = await supabase
        .from('perspectives')
        .select('*')
        .eq('user_id', user.id)
        .order('position', { ascending: true })

      if (error) throw error

      set({ perspectives: data || [], loading: false, error: null })
    } catch (error) {
      set({ loading: false, error: error instanceof Error ? error.message : 'Failed to fetch perspectives' })
    }
  },

  createPerspective: async (perspective) => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('No authenticated user')

      const { data, error } = await supabase
        .from('perspectives')
        .insert({ ...perspective, user_id: user.id })
        .select()
        .single()

      if (error) throw error

      set(state => ({ perspectives: [...state.perspectives, data] }))
      return data
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to create perspective' })
      return null
    }
  },

  updatePerspective: async (id, update) => {
    try {
      const { error } = await supabase
        .from('perspectives')
        .update(update)
        .eq('id', id)

      if (error) throw error

      set(state => ({
        perspectives: state.perspectives.map(p => 
          p.id === id ? { ...p, ...update } : p
        )
      }))
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to update perspective' })
    }
  },

  deletePerspective: async (id) => {
    try {
      const { error } = await supabase
        .from('perspectives')
        .delete()
        .eq('id', id)

      if (error) throw error

      set(state => ({
        perspectives: state.perspectives.filter(p => p.id !== id)
      }))
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to delete perspective' })
    }
  },

  getPerspectiveById: (id) => {
    return get().perspectives.find(p => p.id === id)
  }
}))