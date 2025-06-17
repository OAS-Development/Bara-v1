import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { createClient } from '@/lib/supabase/client';
const supabase = createClient();

export type MetricType = 
  | 'weight' 
  | 'sleep_hours' 
  | 'steps' 
  | 'heart_rate' 
  | 'blood_pressure_systolic'
  | 'blood_pressure_diastolic'
  | 'calories'
  | 'water_intake'
  | 'exercise_minutes';

export interface HealthMetric {
  id: string;
  user_id: string;
  metric_type: MetricType;
  value: number;
  unit: string;
  recorded_at: string;
  notes?: string;
  created_at: string;
}

interface HealthStore {
  metrics: HealthMetric[];
  loading: boolean;
  error: string | null;
  
  // Actions
  fetchMetrics: (type?: MetricType, days?: number) => Promise<void>;
  addMetric: (metric: Omit<HealthMetric, 'id' | 'user_id' | 'created_at'>) => Promise<void>;
  updateMetric: (id: string, updates: Partial<HealthMetric>) => Promise<void>;
  deleteMetric: (id: string) => Promise<void>;
  getLatestMetric: (type: MetricType) => HealthMetric | undefined;
  getMetricsByDateRange: (type: MetricType, startDate: Date, endDate: Date) => HealthMetric[];
}

export const useHealthStore = create<HealthStore>()(
  devtools(
    (set, get) => ({
      metrics: [],
      loading: false,
      error: null,

      fetchMetrics: async (type?: MetricType, days: number = 30) => {
        set({ loading: true, error: null });
        try {
          const startDate = new Date();
          startDate.setDate(startDate.getDate() - days);
          
          let query = supabase
            .from('health_metrics')
            .select('*')
            .gte('recorded_at', startDate.toISOString())
            .order('recorded_at', { ascending: false });
          
          if (type) {
            query = query.eq('metric_type', type);
          }
          
          const { data, error } = await query;
          
          if (error) throw error;
          set({ metrics: data || [], loading: false });
        } catch (error) {
          set({ error: (error as Error).message, loading: false });
        }
      },

      addMetric: async (metric) => {
        set({ loading: true, error: null });
        try {
          const { data: { user } } = await supabase.auth.getUser();
          if (!user) throw new Error('Not authenticated');

          const { data, error } = await supabase
            .from('health_metrics')
            .insert({
              ...metric,
              user_id: user.id,
            })
            .select()
            .single();
          
          if (error) throw error;
          
          set(state => ({
            metrics: [data, ...state.metrics],
            loading: false
          }));
        } catch (error) {
          set({ error: (error as Error).message, loading: false });
        }
      },

      updateMetric: async (id, updates) => {
        set({ loading: true, error: null });
        try {
          const { data, error } = await supabase
            .from('health_metrics')
            .update(updates)
            .eq('id', id)
            .select()
            .single();
          
          if (error) throw error;
          
          set(state => ({
            metrics: state.metrics.map(m => m.id === id ? data : m),
            loading: false
          }));
        } catch (error) {
          set({ error: (error as Error).message, loading: false });
        }
      },

      deleteMetric: async (id) => {
        set({ loading: true, error: null });
        try {
          const { error } = await supabase
            .from('health_metrics')
            .delete()
            .eq('id', id);
          
          if (error) throw error;
          
          set(state => ({
            metrics: state.metrics.filter(m => m.id !== id),
            loading: false
          }));
        } catch (error) {
          set({ error: (error as Error).message, loading: false });
        }
      },

      getLatestMetric: (type: MetricType) => {
        const metrics = get().metrics;
        return metrics
          .filter(m => m.metric_type === type)
          .sort((a, b) => new Date(b.recorded_at).getTime() - new Date(a.recorded_at).getTime())[0];
      },

      getMetricsByDateRange: (type: MetricType, startDate: Date, endDate: Date) => {
        const metrics = get().metrics;
        return metrics
          .filter(m => {
            const date = new Date(m.recorded_at);
            return m.metric_type === type && 
                   date >= startDate && 
                   date <= endDate;
          })
          .sort((a, b) => new Date(a.recorded_at).getTime() - new Date(b.recorded_at).getTime());
      },
    }),
    { name: 'health-store' }
  )
);