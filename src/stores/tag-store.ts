import { create } from 'zustand'
import { createClient } from '@/lib/supabase/client'
import { Database } from '@/types/database.types'

type Tag = Database['public']['Tables']['tags']['Row']
type TagInsert = Database['public']['Tables']['tags']['Insert']
type TagUpdate = Database['public']['Tables']['tags']['Update']

interface TagWithChildren extends Tag {
  children?: TagWithChildren[]
}

interface TagState {
  tags: Tag[]
  tagsTree: TagWithChildren[]
  loading: boolean
  error: string | null
  
  fetchTags: () => Promise<void>
  createTag: (tag: TagInsert) => Promise<Tag | null>
  updateTag: (id: string, update: TagUpdate) => Promise<void>
  deleteTag: (id: string) => Promise<void>
  getTagById: (id: string) => Tag | undefined
  buildTagTree: (tags: Tag[]) => TagWithChildren[]
}

const supabase = createClient()

export const useTagStore = create<TagState>((set, get) => ({
  tags: [],
  tagsTree: [],
  loading: false,
  error: null,

  fetchTags: async () => {
    set({ loading: true })
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('No authenticated user')

      const { data, error } = await supabase
        .from('tags')
        .select('*')
        .eq('user_id', user.id)
        .order('position', { ascending: true })
        .order('name', { ascending: true })

      if (error) throw error

      const tags = data || []
      const tagsTree = get().buildTagTree(tags)
      
      set({ tags, tagsTree, loading: false, error: null })
    } catch (error) {
      set({ loading: false, error: error instanceof Error ? error.message : 'Failed to fetch tags' })
    }
  },

  createTag: async (tag) => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('No authenticated user')

      const { data, error } = await supabase
        .from('tags')
        .insert({ ...tag, user_id: user.id })
        .select()
        .single()

      if (error) throw error

      const tags = [...get().tags, data]
      const tagsTree = get().buildTagTree(tags)
      set({ tags, tagsTree })
      
      return data
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to create tag' })
      return null
    }
  },

  updateTag: async (id, update) => {
    try {
      const { error } = await supabase
        .from('tags')
        .update(update)
        .eq('id', id)

      if (error) throw error

      const tags = get().tags.map(t => 
        t.id === id ? { ...t, ...update } : t
      )
      const tagsTree = get().buildTagTree(tags)
      set({ tags, tagsTree })
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to update tag' })
    }
  },

  deleteTag: async (id) => {
    try {
      const { error } = await supabase
        .from('tags')
        .delete()
        .eq('id', id)

      if (error) throw error

      const tags = get().tags.filter(t => t.id !== id)
      const tagsTree = get().buildTagTree(tags)
      set({ tags, tagsTree })
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to delete tag' })
    }
  },

  getTagById: (id) => {
    return get().tags.find(t => t.id === id)
  },

  buildTagTree: (tags) => {
    const tagMap = new Map<string, TagWithChildren>()
    const rootTags: TagWithChildren[] = []

    // First pass: create all tags
    tags.forEach(tag => {
      tagMap.set(tag.id, { ...tag, children: [] })
    })

    // Second pass: build hierarchy
    tags.forEach(tag => {
      const tagWithChildren = tagMap.get(tag.id)!
      if (tag.parent_id) {
        const parent = tagMap.get(tag.parent_id)
        if (parent && parent.children) {
          parent.children.push(tagWithChildren)
        }
      } else {
        rootTags.push(tagWithChildren)
      }
    })

    // Sort children recursively
    const sortTags = (tags: TagWithChildren[]) => {
      tags.sort((a, b) => {
        const posDiff = (a.position ?? 0) - (b.position ?? 0)
        if (posDiff !== 0) return posDiff
        return (a.name ?? '').localeCompare(b.name ?? '')
      })
      tags.forEach(t => {
        if (t.children && t.children.length > 0) {
          sortTags(t.children)
        }
      })
    }

    sortTags(rootTags)
    return rootTags
  }
}))