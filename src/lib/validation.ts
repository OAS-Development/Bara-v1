import { z } from 'zod'

// Task validation schemas
export const taskSchema = z.object({
  title: z.string().min(1, 'Task title is required').max(500, 'Task title is too long'),
  note: z.string().optional(),
  status: z.enum(['active', 'completed', 'dropped']).default('active'),
  project_id: z.string().uuid().optional(),
  defer_date: z.string().datetime().optional(),
  due_date: z.string().datetime().optional(),
  energy_level: z.enum(['low', 'medium', 'high']).optional(),
  time_estimate: z.number().min(0).max(480).optional(), // in minutes, max 8 hours
  location: z.string().optional(),
  repeat_pattern: z.string().optional(),
  repeat_config: z.any().optional(),
  tags: z.array(z.string().uuid()).optional()
})

export const taskUpdateSchema = taskSchema.partial()

// Project validation schemas
export const projectSchema = z.object({
  name: z.string().min(1, 'Project name is required').max(200, 'Project name is too long'),
  description: z.string().optional(),
  type: z.enum(['parallel', 'sequential', 'single-actions']).default('parallel'),
  status: z.enum(['active', 'on-hold', 'completed', 'dropped']).default('active'),
  parent_id: z.string().uuid().optional(),
  color: z.string().regex(/^#[0-9A-F]{6}$/i, 'Invalid color format').default('#6B7280'),
  review_interval_days: z.number().min(1).max(365).optional(),
  order: z.number().min(0).default(0)
})

export const projectUpdateSchema = projectSchema.partial()

// Tag validation schemas
export const tagSchema = z.object({
  name: z.string().min(1, 'Tag name is required').max(50, 'Tag name is too long'),
  color: z.string().regex(/^#[0-9A-F]{6}$/i, 'Invalid color format').default('#6B7280'),
  icon: z.string().optional(),
  parent_id: z.string().uuid().optional()
})

export const tagUpdateSchema = tagSchema.partial()

// Helper function to validate and return typed data
export function validateData<T>(schema: z.ZodSchema<T>, data: unknown): T {
  return schema.parse(data)
}

// Helper function to safely validate and return result
export function safeValidate<T>(schema: z.ZodSchema<T>, data: unknown): 
  | { success: true; data: T }
  | { success: false; error: z.ZodError } {
  const result = schema.safeParse(data)
  if (result.success) {
    return { success: true, data: result.data }
  }
  return { success: false, error: result.error }
}