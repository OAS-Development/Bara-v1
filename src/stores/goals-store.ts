import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { createClient } from '@/lib/supabase/client';
const supabase = createClient();

export interface Goal {
  id: string;
  user_id: string;
  title: string;
  description?: string;
  category?: 'health' | 'finance' | 'career' | 'personal' | 'relationships' | 'learning';
  target_date?: string;
  status: 'active' | 'paused' | 'completed' | 'abandoned';
  progress: number;
  created_at: string;
  updated_at: string;
  completed_at?: string;
}

export interface GoalMilestone {
  id: string;
  goal_id: string;
  title: string;
  description?: string;
  target_date?: string;
  completed: boolean;
  completed_at?: string;
  order_index: number;
  created_at: string;
  updated_at: string;
}

interface GoalsStore {
  goals: Goal[];
  milestones: GoalMilestone[];
  loading: boolean;
  error: string | null;
  
  // Goal actions
  fetchGoals: (status?: Goal['status']) => Promise<void>;
  addGoal: (goal: Omit<Goal, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => Promise<void>;
  updateGoal: (id: string, updates: Partial<Goal>) => Promise<void>;
  deleteGoal: (id: string) => Promise<void>;
  updateProgress: (id: string, progress: number) => Promise<void>;
  completeGoal: (id: string) => Promise<void>;
  
  // Milestone actions
  fetchMilestones: (goalId?: string) => Promise<void>;
  addMilestone: (milestone: Omit<GoalMilestone, 'id' | 'created_at' | 'updated_at'>) => Promise<void>;
  updateMilestone: (id: string, updates: Partial<GoalMilestone>) => Promise<void>;
  deleteMilestone: (id: string) => Promise<void>;
  toggleMilestone: (id: string) => Promise<void>;
  reorderMilestones: (goalId: string, milestoneIds: string[]) => Promise<void>;
  
  // Computed
  getGoalsByCategory: (category: Goal['category']) => Goal[];
  getGoalMilestones: (goalId: string) => GoalMilestone[];
  calculateGoalProgress: (goalId: string) => number;
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
        set({ loading: true, error: null });
        try {
          let query = supabase
            .from('goals')
            .select('*')
            .order('created_at', { ascending: false });
          
          if (status) {
            query = query.eq('status', status);
          }
          
          const { data, error } = await query;
          
          if (error) throw error;
          set({ goals: data || [], loading: false });
        } catch (error) {
          set({ error: (error as Error).message, loading: false });
        }
      },

      addGoal: async (goal) => {
        set({ loading: true, error: null });
        try {
          const { data: { user } } = await supabase.auth.getUser();
          if (!user) throw new Error('Not authenticated');

          const { data, error } = await supabase
            .from('goals')
            .insert({
              ...goal,
              user_id: user.id,
            })
            .select()
            .single();
          
          if (error) throw error;
          
          set(state => ({
            goals: [data, ...state.goals],
            loading: false
          }));
        } catch (error) {
          set({ error: (error as Error).message, loading: false });
        }
      },

      updateGoal: async (id, updates) => {
        set({ loading: true, error: null });
        try {
          const { data, error } = await supabase
            .from('goals')
            .update({
              ...updates,
              updated_at: new Date().toISOString()
            })
            .eq('id', id)
            .select()
            .single();
          
          if (error) throw error;
          
          set(state => ({
            goals: state.goals.map(g => g.id === id ? data : g),
            loading: false
          }));
        } catch (error) {
          set({ error: (error as Error).message, loading: false });
        }
      },

      deleteGoal: async (id) => {
        set({ loading: true, error: null });
        try {
          const { error } = await supabase
            .from('goals')
            .delete()
            .eq('id', id);
          
          if (error) throw error;
          
          set(state => ({
            goals: state.goals.filter(g => g.id !== id),
            milestones: state.milestones.filter(m => m.goal_id !== id),
            loading: false
          }));
        } catch (error) {
          set({ error: (error as Error).message, loading: false });
        }
      },

      updateProgress: async (id, progress) => {
        await get().updateGoal(id, { progress });
      },

      completeGoal: async (id) => {
        await get().updateGoal(id, {
          status: 'completed',
          progress: 100,
          completed_at: new Date().toISOString()
        });
      },

      // Milestone actions
      fetchMilestones: async (goalId?: string) => {
        set({ loading: true, error: null });
        try {
          let query = supabase
            .from('goal_milestones')
            .select('*')
            .order('order_index');
          
          if (goalId) {
            query = query.eq('goal_id', goalId);
          }
          
          const { data, error } = await query;
          
          if (error) throw error;
          set({ milestones: data || [], loading: false });
        } catch (error) {
          set({ error: (error as Error).message, loading: false });
        }
      },

      addMilestone: async (milestone) => {
        set({ loading: true, error: null });
        try {
          const { data, error } = await supabase
            .from('goal_milestones')
            .insert(milestone)
            .select()
            .single();
          
          if (error) throw error;
          
          set(state => ({
            milestones: [...state.milestones, data],
            loading: false
          }));
          
          // Update goal progress
          get().calculateGoalProgress(milestone.goal_id);
        } catch (error) {
          set({ error: (error as Error).message, loading: false });
        }
      },

      updateMilestone: async (id, updates) => {
        set({ loading: true, error: null });
        try {
          const { data, error } = await supabase
            .from('goal_milestones')
            .update({
              ...updates,
              updated_at: new Date().toISOString()
            })
            .eq('id', id)
            .select()
            .single();
          
          if (error) throw error;
          
          set(state => ({
            milestones: state.milestones.map(m => m.id === id ? data : m),
            loading: false
          }));
          
          // Update goal progress if completion status changed
          if ('completed' in updates) {
            const milestone = get().milestones.find(m => m.id === id);
            if (milestone) {
              const progress = get().calculateGoalProgress(milestone.goal_id);
              await get().updateProgress(milestone.goal_id, progress);
            }
          }
        } catch (error) {
          set({ error: (error as Error).message, loading: false });
        }
      },

      deleteMilestone: async (id) => {
        set({ loading: true, error: null });
        try {
          const milestone = get().milestones.find(m => m.id === id);
          
          const { error } = await supabase
            .from('goal_milestones')
            .delete()
            .eq('id', id);
          
          if (error) throw error;
          
          set(state => ({
            milestones: state.milestones.filter(m => m.id !== id),
            loading: false
          }));
          
          // Update goal progress
          if (milestone) {
            const progress = get().calculateGoalProgress(milestone.goal_id);
            await get().updateProgress(milestone.goal_id, progress);
          }
        } catch (error) {
          set({ error: (error as Error).message, loading: false });
        }
      },

      toggleMilestone: async (id) => {
        const milestone = get().milestones.find(m => m.id === id);
        if (milestone) {
          await get().updateMilestone(id, {
            completed: !milestone.completed,
            completed_at: !milestone.completed ? new Date().toISOString() : undefined
          });
        }
      },

      reorderMilestones: async (goalId, milestoneIds) => {
        set({ loading: true, error: null });
        try {
          const updates = milestoneIds.map((id, index) => ({
            id,
            order_index: index
          }));
          
          // Update each milestone's order
          for (const update of updates) {
            await supabase
              .from('goal_milestones')
              .update({ order_index: update.order_index })
              .eq('id', update.id);
          }
          
          // Refresh milestones
          await get().fetchMilestones(goalId);
          
          set({ loading: false });
        } catch (error) {
          set({ error: (error as Error).message, loading: false });
        }
      },

      // Computed
      getGoalsByCategory: (category) => {
        return get().goals.filter(g => g.category === category);
      },

      getGoalMilestones: (goalId) => {
        return get().milestones
          .filter(m => m.goal_id === goalId)
          .sort((a, b) => a.order_index - b.order_index);
      },

      calculateGoalProgress: (goalId) => {
        const milestones = get().getGoalMilestones(goalId);
        if (milestones.length === 0) return 0;
        
        const completed = milestones.filter(m => m.completed).length;
        return Math.round((completed / milestones.length) * 100);
      },
    }),
    { name: 'goals-store' }
  )
);