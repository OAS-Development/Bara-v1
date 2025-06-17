// Re-export types from database
export type { Database } from './database.types'

// Re-export commonly used types
export type Task = Database['public']['Tables']['tasks']['Row']
export type TaskInsert = Database['public']['Tables']['tasks']['Insert']
export type TaskUpdate = Database['public']['Tables']['tasks']['Update']

export type Project = Database['public']['Tables']['projects']['Row']
export type ProjectInsert = Database['public']['Tables']['projects']['Insert']
export type ProjectUpdate = Database['public']['Tables']['projects']['Update']

export type Tag = Database['public']['Tables']['tags']['Row']
export type TagInsert = Database['public']['Tables']['tags']['Insert']
export type TagUpdate = Database['public']['Tables']['tags']['Update']

export type Perspective = Database['public']['Tables']['perspectives']['Row']
export type PerspectiveInsert = Database['public']['Tables']['perspectives']['Insert']
export type PerspectiveUpdate = Database['public']['Tables']['perspectives']['Update']

// Import types
import type { Database } from './database.types'