import { create } from 'zustand'
import { api, isApiError, getAuthUser, type ApiError } from '@/lib/api/client'
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
  error: ApiError | null

  fetchTags: () => Promise<void>
  createTag: (tag: TagInsert) => Promise<Tag | null>
  updateTag: (id: string, update: TagUpdate) => Promise<void>
  deleteTag: (id: string) => Promise<void>
  getTagById: (id: string) => Tag | undefined
  buildTagTree: (tags: Tag[]) => TagWithChildren[]
  clearError: () => void
}

export const useTagStore = create<TagState>((set, get) => ({
  tags: [],
  tagsTree: [],
  loading: false,
  error: null,

  fetchTags: async () => {
    set({ loading: true, error: null })
    
    const userResult = await getAuthUser()

    if (!userResult.data || !userResult.data.user) {
      set({ loading: false, error: userResult.error || { message: 'No authenticated user' } })
      return
    }

    const result = await api.query(
      () => api.client
        .from('tags')
        .select('*')
        .eq('user_id', userResult.data.user.id)
        .order('position', { ascending: true })
        .order('name', { ascending: true }),
      { errorContext: 'Failed to fetch tags' }
    )

    if (isApiError(result)) {
      set({ loading: false, error: result.error })
      return
    }

    const tags = result.data
    const tagsTree = get().buildTagTree(tags)

    set({ tags, tagsTree, loading: false, error: null })
  },

  createTag: async (tag) => {
    set({ error: null })
    
    const userResult = await getAuthUser()

    if (!userResult.data || !userResult.data.user) {
      set({ error: userResult.error || { message: 'No authenticated user' } })
      return null
    }

    const result = await api.mutate(
      () => api.client
        .from('tags')
        .insert({ ...tag, user_id: userResult.data.user.id })
        .select()
        .single(),
      { 
        successMessage: 'Tag created successfully',
        errorContext: 'Failed to create tag' 
      }
    )

    if (isApiError(result)) {
      set({ error: result.error })
      return null
    }

    const newTag = result.data
    if (!newTag) {
      return null
    }

    const tags = [...get().tags, newTag]
    const tagsTree = get().buildTagTree(tags)
    set({ tags, tagsTree })

    return newTag
  },

  updateTag: async (id, update) => {
    set({ error: null })
    
    const result = await api.mutate(
      () => api.client.from('tags').update(update).eq('id', id),
      { 
        successMessage: 'Tag updated successfully',
        errorContext: 'Failed to update tag' 
      }
    )

    if (isApiError(result)) {
      set({ error: result.error })
      return
    }

    const tags = get().tags.map((t) => (t.id === id ? { ...t, ...update } : t))
    const tagsTree = get().buildTagTree(tags)
    set({ tags, tagsTree })
  },

  deleteTag: async (id) => {
    set({ error: null })
    
    const result = await api.mutate(
      () => api.client.from('tags').delete().eq('id', id),
      { 
        successMessage: 'Tag deleted successfully',
        errorContext: 'Failed to delete tag' 
      }
    )

    if (isApiError(result)) {
      set({ error: result.error })
      return
    }

    const tags = get().tags.filter((t) => t.id !== id)
    const tagsTree = get().buildTagTree(tags)
    set({ tags, tagsTree })
  },

  getTagById: (id) => {
    return get().tags.find((t) => t.id === id)
  },

  buildTagTree: (tags) => {
    const tagMap = new Map<string, TagWithChildren>()
    const rootTags: TagWithChildren[] = []

    // First pass: create all tags
    tags.forEach((tag) => {
      tagMap.set(tag.id, { ...tag, children: [] })
    })

    // Second pass: build hierarchy
    tags.forEach((tag) => {
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
        const posDiff = ((a as any).position ?? 0) - ((b as any).position ?? 0)
        if (posDiff !== 0) return posDiff
        return (a.name ?? '').localeCompare(b.name ?? '')
      })
      tags.forEach((t) => {
        if (t.children && t.children.length > 0) {
          sortTags(t.children)
        }
      })
    }

    sortTags(rootTags)
    return rootTags
  },

  clearError: () => set({ error: null })
}))
