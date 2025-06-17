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
          created_at: string
          filter_rules: Json
          icon: string | null
          id: string
          is_built_in: boolean
          name: string
          position: number
          sort_rules: Json
          user_id: string
        }
        Insert: {
          created_at?: string
          filter_rules?: Json
          icon?: string | null
          id?: string
          is_built_in?: boolean
          name: string
          position?: number
          sort_rules?: Json
          user_id: string
        }
        Update: {
          created_at?: string
          filter_rules?: Json
          icon?: string | null
          id?: string
          is_built_in?: boolean
          name?: string
          position?: number
          sort_rules?: Json
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "perspectives_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      projects: {
        Row: {
          created_at: string
          id: string
          last_reviewed_at: string | null
          name: string
          note: string | null
          parent_id: string | null
          position: number
          review_interval_days: number | null
          status: Database["public"]["Enums"]["task_status"]
          type: Database["public"]["Enums"]["project_type"]
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          last_reviewed_at?: string | null
          name: string
          note?: string | null
          parent_id?: string | null
          position?: number
          review_interval_days?: number | null
          status?: Database["public"]["Enums"]["task_status"]
          type?: Database["public"]["Enums"]["project_type"]
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          last_reviewed_at?: string | null
          name?: string
          note?: string | null
          parent_id?: string | null
          position?: number
          review_interval_days?: number | null
          status?: Database["public"]["Enums"]["task_status"]
          type?: Database["public"]["Enums"]["project_type"]
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "projects_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "projects_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
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
        }
        Relationships: [
          {
            foreignKeyName: "tags_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "tags"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tags_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      task_tags: {
        Row: {
          tag_id: string
          task_id: string
        }
        Insert: {
          tag_id: string
          task_id: string
        }
        Update: {
          tag_id?: string
          task_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "task_tags_tag_id_fkey"
            columns: ["tag_id"]
            isOneToOne: false
            referencedRelation: "tags"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "task_tags_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "tasks"
            referencedColumns: ["id"]
          },
        ]
      }
      tasks: {
        Row: {
          completed_at: string | null
          created_at: string
          defer_date: string | null
          due_date: string | null
          energy_required: Database["public"]["Enums"]["energy_level"] | null
          estimated_minutes: number | null
          id: string
          note: string | null
          position: number
          project_id: string | null
          repeat_interval: number | null
          repeat_unit: Database["public"]["Enums"]["repeat_unit"] | null
          status: Database["public"]["Enums"]["task_status"]
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          completed_at?: string | null
          created_at?: string
          defer_date?: string | null
          due_date?: string | null
          energy_required?: Database["public"]["Enums"]["energy_level"] | null
          estimated_minutes?: number | null
          id?: string
          note?: string | null
          position?: number
          project_id?: string | null
          repeat_interval?: number | null
          repeat_unit?: Database["public"]["Enums"]["repeat_unit"] | null
          status?: Database["public"]["Enums"]["task_status"]
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          completed_at?: string | null
          created_at?: string
          defer_date?: string | null
          due_date?: string | null
          energy_required?: Database["public"]["Enums"]["energy_level"] | null
          estimated_minutes?: number | null
          id?: string
          note?: string | null
          position?: number
          project_id?: string | null
          repeat_interval?: number | null
          repeat_unit?: Database["public"]["Enums"]["repeat_unit"] | null
          status?: Database["public"]["Enums"]["task_status"]
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "tasks_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tasks_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
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
      energy_level: "low" | "medium" | "high"
      project_type: "sequential" | "parallel" | "single-actions"
      repeat_unit: "days" | "weeks" | "months" | "years"
      task_status: "active" | "completed" | "dropped"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}