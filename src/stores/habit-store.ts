import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { createClient } from '@/lib/supabase/client';
const supabase = createClient();

export interface Habit {
  id: string;
  user_id: string;
  name: string;
  description?: string;
  frequency: 'daily' | 'weekly' | 'monthly';
  target_count: number;
  color?: string;
  icon?: string;
  active: boolean;
  created_at: string;
  updated_at: string;
}

export interface HabitCompletion {
  id: string;
  habit_id: string;
  completed_at: string;
  notes?: string;
  created_at: string;
}

interface HabitStore {
  habits: Habit[];
  completions: HabitCompletion[];
  loading: boolean;
  error: string | null;
  
  // Actions
  fetchHabits: () => Promise<void>;
  fetchCompletions: (days?: number) => Promise<void>;
  addHabit: (habit: Omit<Habit, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => Promise<void>;
  updateHabit: (id: string, updates: Partial<Habit>) => Promise<void>;
  deleteHabit: (id: string) => Promise<void>;
  toggleHabitActive: (id: string) => Promise<void>;
  recordCompletion: (habitId: string, notes?: string) => Promise<void>;
  removeCompletion: (completionId: string) => Promise<void>;
  
  // Computed
  getStreak: (habitId: string) => number;
  getCompletionsForDate: (date: Date) => HabitCompletion[];
  getHabitCompletionsForDate: (habitId: string, date: Date) => HabitCompletion[];
  isHabitCompletedForDate: (habitId: string, date: Date) => boolean;
}

export const useHabitStore = create<HabitStore>()(
  devtools(
    (set, get) => ({
      habits: [],
      completions: [],
      loading: false,
      error: null,

      fetchHabits: async () => {
        set({ loading: true, error: null });
        try {
          const { data, error } = await supabase
            .from('habits')
            .select('*')
            .order('created_at', { ascending: false });
          
          if (error) throw error;
          set({ habits: data || [], loading: false });
        } catch (error) {
          set({ error: (error as Error).message, loading: false });
        }
      },

      fetchCompletions: async (days: number = 30) => {
        set({ loading: true, error: null });
        try {
          const startDate = new Date();
          startDate.setDate(startDate.getDate() - days);
          
          const { data, error } = await supabase
            .from('habit_completions')
            .select('*')
            .gte('completed_at', startDate.toISOString())
            .order('completed_at', { ascending: false });
          
          if (error) throw error;
          set({ completions: data || [], loading: false });
        } catch (error) {
          set({ error: (error as Error).message, loading: false });
        }
      },

      addHabit: async (habit) => {
        set({ loading: true, error: null });
        try {
          const { data: { user } } = await supabase.auth.getUser();
          if (!user) throw new Error('Not authenticated');

          const { data, error } = await supabase
            .from('habits')
            .insert({
              ...habit,
              user_id: user.id,
            })
            .select()
            .single();
          
          if (error) throw error;
          
          set(state => ({
            habits: [data, ...state.habits],
            loading: false
          }));
        } catch (error) {
          set({ error: (error as Error).message, loading: false });
        }
      },

      updateHabit: async (id, updates) => {
        set({ loading: true, error: null });
        try {
          const { data, error } = await supabase
            .from('habits')
            .update({
              ...updates,
              updated_at: new Date().toISOString()
            })
            .eq('id', id)
            .select()
            .single();
          
          if (error) throw error;
          
          set(state => ({
            habits: state.habits.map(h => h.id === id ? data : h),
            loading: false
          }));
        } catch (error) {
          set({ error: (error as Error).message, loading: false });
        }
      },

      deleteHabit: async (id) => {
        set({ loading: true, error: null });
        try {
          const { error } = await supabase
            .from('habits')
            .delete()
            .eq('id', id);
          
          if (error) throw error;
          
          set(state => ({
            habits: state.habits.filter(h => h.id !== id),
            completions: state.completions.filter(c => c.habit_id !== id),
            loading: false
          }));
        } catch (error) {
          set({ error: (error as Error).message, loading: false });
        }
      },

      toggleHabitActive: async (id) => {
        const habit = get().habits.find(h => h.id === id);
        if (habit) {
          await get().updateHabit(id, { active: !habit.active });
        }
      },

      recordCompletion: async (habitId, notes) => {
        set({ loading: true, error: null });
        try {
          const { data, error } = await supabase
            .from('habit_completions')
            .insert({
              habit_id: habitId,
              notes,
            })
            .select()
            .single();
          
          if (error) throw error;
          
          set(state => ({
            completions: [data, ...state.completions],
            loading: false
          }));
        } catch (error) {
          set({ error: (error as Error).message, loading: false });
        }
      },

      removeCompletion: async (completionId) => {
        set({ loading: true, error: null });
        try {
          const { error } = await supabase
            .from('habit_completions')
            .delete()
            .eq('id', completionId);
          
          if (error) throw error;
          
          set(state => ({
            completions: state.completions.filter(c => c.id !== completionId),
            loading: false
          }));
        } catch (error) {
          set({ error: (error as Error).message, loading: false });
        }
      },

      getStreak: (habitId) => {
        const completions = get().completions
          .filter(c => c.habit_id === habitId)
          .sort((a, b) => new Date(b.completed_at).getTime() - new Date(a.completed_at).getTime());
        
        if (completions.length === 0) return 0;
        
        let streak = 0;
        let currentDate = new Date();
        currentDate.setHours(0, 0, 0, 0);
        
        for (const completion of completions) {
          const completionDate = new Date(completion.completed_at);
          completionDate.setHours(0, 0, 0, 0);
          
          if (completionDate.getTime() === currentDate.getTime()) {
            streak++;
            currentDate.setDate(currentDate.getDate() - 1);
          } else if (completionDate.getTime() < currentDate.getTime()) {
            break;
          }
        }
        
        return streak;
      },

      getCompletionsForDate: (date) => {
        const startOfDay = new Date(date);
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date(date);
        endOfDay.setHours(23, 59, 59, 999);
        
        return get().completions.filter(c => {
          const completionDate = new Date(c.completed_at);
          return completionDate >= startOfDay && completionDate <= endOfDay;
        });
      },

      getHabitCompletionsForDate: (habitId, date) => {
        return get().getCompletionsForDate(date).filter(c => c.habit_id === habitId);
      },

      isHabitCompletedForDate: (habitId, date) => {
        return get().getHabitCompletionsForDate(habitId, date).length > 0;
      },
    }),
    { name: 'habit-store' }
  )
);