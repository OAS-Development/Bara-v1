import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { api, isApiError, getAuthUser, type ApiError } from '@/lib/api/client'
import { JournalEncryption } from '@/lib/encryption'

export interface JournalEntry {
  id: string
  user_id: string
  content_encrypted: string
  mood?: 'happy' | 'neutral' | 'sad' | 'anxious' | 'excited' | 'angry' | 'calm'
  tags: string[]
  entry_date: string
  weather?: string
  location?: string
  created_at: string
  updated_at: string
}

interface JournalStore {
  entries: JournalEntry[]
  decryptedContent: Map<string, string>
  loading: boolean
  error: ApiError | null
  encryptionKey: string | null

  // Key management
  setEncryptionKey: (key: string) => void
  generateNewKey: () => string
  clearEncryptionKey: () => void

  // Entry actions
  fetchEntries: (year?: number, month?: number) => Promise<void>
  addEntry: (entry: {
    content: string
    mood?: JournalEntry['mood']
    tags?: string[]
    entry_date?: string
    weather?: string
    location?: string
  }) => Promise<void>
  updateEntry: (
    id: string,
    updates: {
      content?: string
      mood?: JournalEntry['mood']
      tags?: string[]
      weather?: string
      location?: string
    }
  ) => Promise<void>
  deleteEntry: (id: string) => Promise<void>

  // Decrypt content
  decryptEntry: (entryId: string) => Promise<string>

  // Search and filter
  searchEntries: (query: string) => Promise<JournalEntry[]>
  getEntriesByMood: (mood: JournalEntry['mood']) => JournalEntry[]
  getEntriesByTag: (tag: string) => JournalEntry[]
  
  // Error management
  clearError: () => void
}

export const useJournalStore = create<JournalStore>()(
  devtools(
    (set, get) => ({
      entries: [],
      decryptedContent: new Map(),
      loading: false,
      error: null,
      encryptionKey: JournalEncryption.getStoredKey(),

      // Key management
      setEncryptionKey: (key: string) => {
        JournalEncryption.storeKey(key)
        set({ encryptionKey: key, decryptedContent: new Map() })
      },

      generateNewKey: () => {
        const key = JournalEncryption.generateSecurePassword()
        get().setEncryptionKey(key)
        return key
      },

      clearEncryptionKey: () => {
        JournalEncryption.clearStoredKey()
        set({ encryptionKey: null, decryptedContent: new Map() })
      },

      // Entry actions
      fetchEntries: async (year?: number, month?: number) => {
        set({ loading: true, error: null })
        
        let queryBuilder = () => {
          let query = api.client
            .from('journal_entries')
            .select('*')
            .order('entry_date', { ascending: false })

          if (year && month) {
            const startDate = new Date(year, month - 1, 1)
            const endDate = new Date(year, month, 0)
            query = query
              .gte('entry_date', startDate.toISOString().split('T')[0])
              .lte('entry_date', endDate.toISOString().split('T')[0])
          }

          return query
        }

        const result = await api.query(
          queryBuilder,
          { errorContext: 'Failed to fetch journal entries' }
        )

        if (isApiError(result)) {
          set({ loading: false, error: result.error })
          return
        }

        set({ entries: result.data, loading: false })
      },

      addEntry: async (entry) => {
        set({ loading: true, error: null })
        
        const userResult = await getAuthUser()

        if (!userResult.data || !userResult.data.user) {
          set({ loading: false, error: userResult.error || { message: 'Not authenticated' } })
          return
        }

        const encryptionKey = get().encryptionKey
        if (!encryptionKey) {
          set({ loading: false, error: { message: 'No encryption key set' } })
          return
        }

        try {
          // Encrypt content
          const encrypted = await JournalEncryption.encrypt(entry.content, encryptionKey)

          const result = await api.mutate(
            () => api.client
              .from('journal_entries')
              .insert({
                user_id: userResult.data.user.id,
                content_encrypted: encrypted,
                mood: entry.mood,
                tags: entry.tags || [],
                entry_date: entry.entry_date || new Date().toISOString().split('T')[0],
                weather: entry.weather,
                location: entry.location
              })
              .select()
              .single(),
            { 
              successMessage: 'Journal entry added successfully',
              errorContext: 'Failed to add journal entry' 
            }
          )

          if (isApiError(result)) {
            set({ loading: false, error: result.error })
            return
          }

          if (result.data) {
            const newEntry = result.data as JournalEntry
            // Cache decrypted content
            get().decryptedContent.set(newEntry.id, entry.content)

            set((state) => ({
              entries: [newEntry, ...state.entries],
              loading: false
            }))
          }
        } catch (error) {
          set({ loading: false, error: { message: (error as Error).message } })
        }
      },

      updateEntry: async (id, updates) => {
        set({ loading: true, error: null })
        
        const encryptionKey = get().encryptionKey
        if (!encryptionKey) {
          set({ loading: false, error: { message: 'No encryption key set' } })
          return
        }

        try {
          const updateData: any = {
            updated_at: new Date().toISOString()
          }

          // If content is being updated, encrypt it
          if (updates.content) {
            updateData.content_encrypted = await JournalEncryption.encrypt(
              updates.content,
              encryptionKey
            )
            get().decryptedContent.set(id, updates.content)
          }

          // Add other fields
          if (updates.mood !== undefined) updateData.mood = updates.mood
          if (updates.tags !== undefined) updateData.tags = updates.tags
          if (updates.weather !== undefined) updateData.weather = updates.weather
          if (updates.location !== undefined) updateData.location = updates.location

          const result = await api.mutate(
            () => api.client
              .from('journal_entries')
              .update(updateData)
              .eq('id', id)
              .select()
              .single(),
            { 
              successMessage: 'Journal entry updated successfully',
              errorContext: 'Failed to update journal entry' 
            }
          )

          if (isApiError(result)) {
            set({ loading: false, error: result.error })
            return
          }

          if (result.data) {
            const updatedEntry = result.data as JournalEntry
            set((state) => ({
              entries: state.entries.map((e) => (e.id === id ? updatedEntry : e)),
              loading: false
            }))
          }
        } catch (error) {
          set({ loading: false, error: { message: (error as Error).message } })
        }
      },

      deleteEntry: async (id) => {
        set({ loading: true, error: null })
        
        const result = await api.mutate(
          () => api.client.from('journal_entries').delete().eq('id', id),
          { 
            successMessage: 'Journal entry deleted successfully',
            errorContext: 'Failed to delete journal entry' 
          }
        )

        if (isApiError(result)) {
          set({ loading: false, error: result.error })
          return
        }

        get().decryptedContent.delete(id)

        set((state) => ({
          entries: state.entries.filter((e) => e.id !== id),
          loading: false
        }))
      },

      // Decrypt content
      decryptEntry: async (entryId: string) => {
        const cached = get().decryptedContent.get(entryId)
        if (cached) return cached

        const entry = get().entries.find((e) => e.id === entryId)
        if (!entry) throw new Error('Entry not found')

        const encryptionKey = get().encryptionKey
        if (!encryptionKey) throw new Error('No encryption key set')

        try {
          const decrypted = await JournalEncryption.decrypt(entry.content_encrypted, encryptionKey)
          get().decryptedContent.set(entryId, decrypted)
          return decrypted
        } catch (error) {
          throw new Error('Failed to decrypt entry. Check your encryption key.')
        }
      },

      // Search and filter
      searchEntries: async (query: string) => {
        const entries = get().entries
        const results: JournalEntry[] = []
        const encryptionKey = get().encryptionKey

        if (!encryptionKey) return []

        for (const entry of entries) {
          try {
            const content = await get().decryptEntry(entry.id)
            if (
              content.toLowerCase().includes(query.toLowerCase()) ||
              entry.tags.some((tag) => tag.toLowerCase().includes(query.toLowerCase()))
            ) {
              results.push(entry)
            }
          } catch {
            // Skip entries that can't be decrypted
          }
        }

        return results
      },

      getEntriesByMood: (mood: JournalEntry['mood']) => {
        return get().entries.filter((e) => e.mood === mood)
      },

      getEntriesByTag: (tag: string) => {
        return get().entries.filter((e) => e.tags.includes(tag))
      },
      
      clearError: () => set({ error: null })
    }),
    { name: 'journal-store' }
  )
)
