export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      perspectives: {
        Row: {
          category_type: string | null
          created_at: string | null
          defer_days: number | null
          id: string
          include_archived: boolean
          name: string
          sort_by: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          category_type?: string | null
          created_at?: string | null
          defer_days?: number | null
          id?: string
          include_archived?: boolean
          name: string
          sort_by?: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          category_type?: string | null
          created_at?: string | null
          defer_days?: number | null
          id?: string
          include_archived?: boolean
          name?: string
          sort_by?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: 'perspectives_user_id_fkey'
            columns: ['user_id']
            isOneToOne: false
            referencedRelation: 'users'
            referencedColumns: ['id']
          }
        ]
      }
      projects: {
        Row: {
          color: string
          created_at: string
          description: string | null
          id: string
          name: string
          order: number
          parent_id: string | null
          review_interval_days: number | null
          last_reviewed_at: string | null
          status: Database['public']['Enums']['project_status']
          type: Database['public']['Enums']['project_type']
          updated_at: string
          user_id: string
        }
        Insert: {
          color?: string
          created_at?: string
          description?: string | null
          id?: string
          name: string
          order?: number
          parent_id?: string | null
          review_interval_days?: number | null
          last_reviewed_at?: string | null
          status?: Database['public']['Enums']['project_status']
          type?: Database['public']['Enums']['project_type']
          updated_at?: string
          user_id: string
        }
        Update: {
          color?: string
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          order?: number
          parent_id?: string | null
          review_interval_days?: number | null
          last_reviewed_at?: string | null
          status?: Database['public']['Enums']['project_status']
          type?: Database['public']['Enums']['project_type']
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: 'projects_parent_id_fkey'
            columns: ['parent_id']
            isOneToOne: false
            referencedRelation: 'projects'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'projects_user_id_fkey'
            columns: ['user_id']
            isOneToOne: false
            referencedRelation: 'users'
            referencedColumns: ['id']
          }
        ]
      }
      tags: {
        Row: {
          color: string
          created_at: string
          icon: string | null
          id: string
          name: string
          parent_id: string | null
          position: number
          user_id: string
          updated_at: string
        }
        Insert: {
          color?: string
          created_at?: string
          icon?: string | null
          id?: string
          name: string
          parent_id?: string | null
          position?: number
          user_id: string
          updated_at?: string
        }
        Update: {
          color?: string
          created_at?: string
          icon?: string | null
          id?: string
          name?: string
          parent_id?: string | null
          position?: number
          user_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'tags_parent_id_fkey'
            columns: ['parent_id']
            isOneToOne: false
            referencedRelation: 'tags'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'tags_user_id_fkey'
            columns: ['user_id']
            isOneToOne: false
            referencedRelation: 'users'
            referencedColumns: ['id']
          }
        ]
      }
      task_tags: {
        Row: {
          created_at: string
          tag_id: string
          task_id: string
        }
        Insert: {
          created_at?: string
          tag_id: string
          task_id: string
        }
        Update: {
          created_at?: string
          tag_id?: string
          task_id?: string
        }
        Relationships: [
          {
            foreignKeyName: 'task_tags_tag_id_fkey'
            columns: ['tag_id']
            isOneToOne: false
            referencedRelation: 'tags'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'task_tags_task_id_fkey'
            columns: ['task_id']
            isOneToOne: false
            referencedRelation: 'tasks'
            referencedColumns: ['id']
          }
        ]
      }
      tasks: {
        Row: {
          completed_at: string | null
          created_at: string
          defer_date: string | null
          due_date: string | null
          energy_required: Database['public']['Enums']['energy_level'] | null
          estimated_minutes: number | null
          id: string
          location: string | null
          note: string | null
          position: number
          project_id: string | null
          repeat_interval: number | null
          repeat_unit: Database['public']['Enums']['repeat_unit'] | null
          status: Database['public']['Enums']['task_status']
          time_of_day: string | null
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          completed_at?: string | null
          created_at?: string
          defer_date?: string | null
          due_date?: string | null
          energy_required?: Database['public']['Enums']['energy_level'] | null
          estimated_minutes?: number | null
          id?: string
          location?: string | null
          note?: string | null
          position?: number
          project_id?: string | null
          repeat_interval?: number | null
          repeat_unit?: Database['public']['Enums']['repeat_unit'] | null
          status?: Database['public']['Enums']['task_status']
          time_of_day?: string | null
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          completed_at?: string | null
          created_at?: string
          defer_date?: string | null
          due_date?: string | null
          energy_required?: Database['public']['Enums']['energy_level'] | null
          estimated_minutes?: number | null
          id?: string
          location?: string | null
          note?: string | null
          position?: number
          project_id?: string | null
          repeat_interval?: number | null
          repeat_unit?: Database['public']['Enums']['repeat_unit'] | null
          status?: Database['public']['Enums']['task_status']
          time_of_day?: string | null
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: 'tasks_project_id_fkey'
            columns: ['project_id']
            isOneToOne: false
            referencedRelation: 'projects'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'tasks_user_id_fkey'
            columns: ['user_id']
            isOneToOne: false
            referencedRelation: 'users'
            referencedColumns: ['id']
          }
        ]
      }
      habits: {
        Row: {
          id: string
          user_id: string
          name: string
          category: string
          frequency: string
          target: number | null
          unit: string | null
          color: string
          icon: string | null
          active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          category: string
          frequency?: string
          target?: number | null
          unit?: string | null
          color?: string
          icon?: string | null
          active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          category?: string
          frequency?: string
          target?: number | null
          unit?: string | null
          color?: string
          icon?: string | null
          active?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'habits_user_id_fkey'
            columns: ['user_id']
            isOneToOne: false
            referencedRelation: 'users'
            referencedColumns: ['id']
          }
        ]
      }
      habit_completions: {
        Row: {
          id: string
          habit_id: string
          completed_at: string
          value: number | null
          notes: string | null
          created_at: string
        }
        Insert: {
          id?: string
          habit_id: string
          completed_at?: string
          value?: number | null
          notes?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          habit_id?: string
          completed_at?: string
          value?: number | null
          notes?: string | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'habit_completions_habit_id_fkey'
            columns: ['habit_id']
            isOneToOne: false
            referencedRelation: 'habits'
            referencedColumns: ['id']
          }
        ]
      }
      health_metrics: {
        Row: {
          id: string
          user_id: string
          metric_type: string
          value: number
          unit: string
          recorded_at: string
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          metric_type: string
          value: number
          unit: string
          recorded_at?: string
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          metric_type?: string
          value?: number
          unit?: string
          recorded_at?: string
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'health_metrics_user_id_fkey'
            columns: ['user_id']
            isOneToOne: false
            referencedRelation: 'users'
            referencedColumns: ['id']
          }
        ]
      }
      goals: {
        Row: {
          id: string
          user_id: string
          title: string
          description: string | null
          category: string
          status: string
          priority: string
          target_date: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          description?: string | null
          category?: string
          status?: string
          priority?: string
          target_date?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          description?: string | null
          category?: string
          status?: string
          priority?: string
          target_date?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'goals_user_id_fkey'
            columns: ['user_id']
            isOneToOne: false
            referencedRelation: 'users'
            referencedColumns: ['id']
          }
        ]
      }
      milestones: {
        Row: {
          id: string
          goal_id: string
          title: string
          completed: boolean
          completed_at: string | null
          target_date: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          goal_id: string
          title: string
          completed?: boolean
          completed_at?: string | null
          target_date?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          goal_id?: string
          title?: string
          completed?: boolean
          completed_at?: string | null
          target_date?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'milestones_goal_id_fkey'
            columns: ['goal_id']
            isOneToOne: false
            referencedRelation: 'goals'
            referencedColumns: ['id']
          }
        ]
      }
      journal_entries: {
        Row: {
          id: string
          user_id: string
          title: string | null
          content: string
          mood: string | null
          tags: string[] | null
          encrypted: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title?: string | null
          content: string
          mood?: string | null
          tags?: string[] | null
          encrypted?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string | null
          content?: string
          mood?: string | null
          tags?: string[] | null
          encrypted?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'journal_entries_user_id_fkey'
            columns: ['user_id']
            isOneToOne: false
            referencedRelation: 'users'
            referencedColumns: ['id']
          }
        ]
      }
      financial_accounts: {
        Row: {
          id: string
          user_id: string
          name: string
          type: string
          balance: number | null
          currency: string
          institution: string | null
          account_number: string | null
          active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          type?: string
          balance?: number | null
          currency?: string
          institution?: string | null
          account_number?: string | null
          active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          type?: string
          balance?: number | null
          currency?: string
          institution?: string | null
          account_number?: string | null
          active?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'financial_accounts_user_id_fkey'
            columns: ['user_id']
            isOneToOne: false
            referencedRelation: 'users'
            referencedColumns: ['id']
          }
        ]
      }
      financial_transactions: {
        Row: {
          id: string
          user_id: string
          account_id: string
          amount: number
          type: string
          category: string
          description: string | null
          date: string
          recurring: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          account_id: string
          amount: number
          type?: string
          category: string
          description?: string | null
          date?: string
          recurring?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          account_id?: string
          amount?: number
          type?: string
          category?: string
          description?: string | null
          date?: string
          recurring?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'financial_transactions_account_id_fkey'
            columns: ['account_id']
            isOneToOne: false
            referencedRelation: 'financial_accounts'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'financial_transactions_user_id_fkey'
            columns: ['user_id']
            isOneToOne: false
            referencedRelation: 'users'
            referencedColumns: ['id']
          }
        ]
      }
      budgets: {
        Row: {
          id: string
          user_id: string
          name: string
          category: string
          amount: number
          period: string
          start_date: string
          end_date: string | null
          active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          category: string
          amount: number
          period?: string
          start_date?: string
          end_date?: string | null
          active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          category?: string
          amount?: number
          period?: string
          start_date?: string
          end_date?: string | null
          active?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'budgets_user_id_fkey'
            columns: ['user_id']
            isOneToOne: false
            referencedRelation: 'users'
            referencedColumns: ['id']
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      energy_level: 'low' | 'medium' | 'high'
      perspective_category: 'next' | 'waiting' | 'scheduled' | 'someday'
      project_status: 'active' | 'on-hold' | 'completed' | 'dropped'
      project_type: 'sequential' | 'parallel' | 'single-actions'
      repeat_unit: 'days' | 'weeks' | 'months' | 'years'
      task_status: 'active' | 'completed' | 'dropped'
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}