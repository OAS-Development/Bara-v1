import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { createClient } from './client'
import type { Database } from '@/types/database.types'

type Task = Database['public']['Tables']['tasks']['Row']
type Project = Database['public']['Tables']['projects']['Row']

export function useTasks() {
  const supabase = createClient()
  
  return useQuery({
    queryKey: ['tasks'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('tasks')
        .select('*, project:projects(*), tags:task_tags(tag:tags(*))')
        .eq('status', 'active')
        .order('position')
      
      if (error) throw error
      return data
    }
  })
}

export function useCreateTask() {
  const queryClient = useQueryClient()
  const supabase = createClient()
  
  return useMutation({
    mutationFn: async (task: Partial<Task>) => {
      const { data, error } = await supabase
        .from('tasks')
        .insert(task)
        .select()
        .single()
      
      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] })
    }
  })
}