import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { createClient } from '@/lib/supabase/client';
const supabase = createClient();
import { JournalEncryption } from '@/lib/encryption';

export interface JournalEntry {
  id: string;
  user_id: string;
  content_encrypted: string;
  mood?: 'happy' | 'neutral' | 'sad' | 'anxious' | 'excited' | 'angry' | 'calm';
  tags: string[];
  entry_date: string;
  weather?: string;
  location?: string;
  created_at: string;
  updated_at: string;
}

interface JournalStore {
  entries: JournalEntry[];
  decryptedContent: Map<string, string>;
  loading: boolean;
  error: string | null;
  encryptionKey: string | null;
  
  // Key management
  setEncryptionKey: (key: string) => void;
  generateNewKey: () => string;
  clearEncryptionKey: () => void;
  
  // Entry actions
  fetchEntries: (year?: number, month?: number) => Promise<void>;
  addEntry: (entry: {
    content: string;
    mood?: JournalEntry['mood'];
    tags?: string[];
    entry_date?: string;
    weather?: string;
    location?: string;
  }) => Promise<void>;
  updateEntry: (id: string, updates: {
    content?: string;
    mood?: JournalEntry['mood'];
    tags?: string[];
    weather?: string;
    location?: string;
  }) => Promise<void>;
  deleteEntry: (id: string) => Promise<void>;
  
  // Decrypt content
  decryptEntry: (entryId: string) => Promise<string>;
  
  // Search and filter
  searchEntries: (query: string) => Promise<JournalEntry[]>;
  getEntriesByMood: (mood: JournalEntry['mood']) => JournalEntry[];
  getEntriesByTag: (tag: string) => JournalEntry[];
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
        JournalEncryption.storeKey(key);
        set({ encryptionKey: key, decryptedContent: new Map() });
      },

      generateNewKey: () => {
        const key = JournalEncryption.generateSecurePassword();
        get().setEncryptionKey(key);
        return key;
      },

      clearEncryptionKey: () => {
        JournalEncryption.clearStoredKey();
        set({ encryptionKey: null, decryptedContent: new Map() });
      },

      // Entry actions
      fetchEntries: async (year?: number, month?: number) => {
        set({ loading: true, error: null });
        try {
          let query = supabase
            .from('journal_entries')
            .select('*')
            .order('entry_date', { ascending: false });
          
          if (year && month) {
            const startDate = new Date(year, month - 1, 1);
            const endDate = new Date(year, month, 0);
            query = query
              .gte('entry_date', startDate.toISOString().split('T')[0])
              .lte('entry_date', endDate.toISOString().split('T')[0]);
          }
          
          const { data, error } = await query;
          
          if (error) throw error;
          set({ entries: data || [], loading: false });
        } catch (error) {
          set({ error: (error as Error).message, loading: false });
        }
      },

      addEntry: async (entry) => {
        set({ loading: true, error: null });
        try {
          const { data: { user } } = await supabase.auth.getUser();
          if (!user) throw new Error('Not authenticated');

          const encryptionKey = get().encryptionKey;
          if (!encryptionKey) throw new Error('No encryption key set');

          // Encrypt content
          const encrypted = await JournalEncryption.encrypt(entry.content, encryptionKey);

          const { data, error } = await supabase
            .from('journal_entries')
            .insert({
              user_id: user.id,
              content_encrypted: encrypted,
              mood: entry.mood,
              tags: entry.tags || [],
              entry_date: entry.entry_date || new Date().toISOString().split('T')[0],
              weather: entry.weather,
              location: entry.location,
            })
            .select()
            .single();
          
          if (error) throw error;
          
          // Cache decrypted content
          get().decryptedContent.set(data.id, entry.content);
          
          set(state => ({
            entries: [data, ...state.entries],
            loading: false
          }));
        } catch (error) {
          set({ error: (error as Error).message, loading: false });
        }
      },

      updateEntry: async (id, updates) => {
        set({ loading: true, error: null });
        try {
          const encryptionKey = get().encryptionKey;
          if (!encryptionKey) throw new Error('No encryption key set');

          const updateData: any = {
            updated_at: new Date().toISOString()
          };

          // If content is being updated, encrypt it
          if (updates.content) {
            updateData.content_encrypted = await JournalEncryption.encrypt(updates.content, encryptionKey);
            get().decryptedContent.set(id, updates.content);
          }

          // Add other fields
          if (updates.mood !== undefined) updateData.mood = updates.mood;
          if (updates.tags !== undefined) updateData.tags = updates.tags;
          if (updates.weather !== undefined) updateData.weather = updates.weather;
          if (updates.location !== undefined) updateData.location = updates.location;

          const { data, error } = await supabase
            .from('journal_entries')
            .update(updateData)
            .eq('id', id)
            .select()
            .single();
          
          if (error) throw error;
          
          set(state => ({
            entries: state.entries.map(e => e.id === id ? data : e),
            loading: false
          }));
        } catch (error) {
          set({ error: (error as Error).message, loading: false });
        }
      },

      deleteEntry: async (id) => {
        set({ loading: true, error: null });
        try {
          const { error } = await supabase
            .from('journal_entries')
            .delete()
            .eq('id', id);
          
          if (error) throw error;
          
          get().decryptedContent.delete(id);
          
          set(state => ({
            entries: state.entries.filter(e => e.id !== id),
            loading: false
          }));
        } catch (error) {
          set({ error: (error as Error).message, loading: false });
        }
      },

      // Decrypt content
      decryptEntry: async (entryId: string) => {
        const cached = get().decryptedContent.get(entryId);
        if (cached) return cached;

        const entry = get().entries.find(e => e.id === entryId);
        if (!entry) throw new Error('Entry not found');

        const encryptionKey = get().encryptionKey;
        if (!encryptionKey) throw new Error('No encryption key set');

        try {
          const decrypted = await JournalEncryption.decrypt(entry.content_encrypted, encryptionKey);
          get().decryptedContent.set(entryId, decrypted);
          return decrypted;
        } catch (error) {
          throw new Error('Failed to decrypt entry. Check your encryption key.');
        }
      },

      // Search and filter
      searchEntries: async (query: string) => {
        const entries = get().entries;
        const results: JournalEntry[] = [];
        const encryptionKey = get().encryptionKey;
        
        if (!encryptionKey) return [];

        for (const entry of entries) {
          try {
            const content = await get().decryptEntry(entry.id);
            if (content.toLowerCase().includes(query.toLowerCase()) ||
                entry.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase()))) {
              results.push(entry);
            }
          } catch {
            // Skip entries that can't be decrypted
          }
        }

        return results;
      },

      getEntriesByMood: (mood: JournalEntry['mood']) => {
        return get().entries.filter(e => e.mood === mood);
      },

      getEntriesByTag: (tag: string) => {
        return get().entries.filter(e => e.tags.includes(tag));
      },
    }),
    { name: 'journal-store' }
  )
);