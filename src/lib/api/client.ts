import { createClient } from '@/lib/supabase/client'
import type { PostgrestError } from '@supabase/supabase-js'
import { toast } from 'sonner'

export type ApiError = {
  message: string
  code?: string
  details?: any
}

export type ApiResult<T> = 
  | { data: T; error: null }
  | { data: null; error: ApiError }

class ApiClient {
  private supabase = createClient()

  // Generic error handler
  private handleError(error: PostgrestError | Error | unknown): ApiError {
    if ((error as PostgrestError)?.code) {
      const pgError = error as PostgrestError
      return {
        message: pgError.message,
        code: pgError.code,
        details: pgError.details
      }
    }
    
    if (error instanceof Error) {
      return {
        message: error.message
      }
    }
    
    return {
      message: 'An unexpected error occurred'
    }
  }

  // Show error toast with consistent formatting
  private showError(error: ApiError, context?: string) {
    const message = context 
      ? `${context}: ${error.message}`
      : error.message
    
    toast.error(message)
    console.error('API Error:', error)
  }

  // Wrapper for Supabase queries with consistent error handling
  async query<T>(
    queryFn: () => Promise<{ data: T | null; error: PostgrestError | null }> | PromiseLike<{ data: T | null; error: PostgrestError | null }>,
    options?: {
      showToast?: boolean
      errorContext?: string
    }
  ): Promise<ApiResult<T>> {
    try {
      const { data, error } = await queryFn()
      
      if (error) {
        const apiError = this.handleError(error)
        if (options?.showToast !== false) {
          this.showError(apiError, options?.errorContext)
        }
        return { data: null, error: apiError }
      }
      
      if (!data) {
        const apiError = { message: 'No data returned' }
        if (options?.showToast !== false) {
          this.showError(apiError, options?.errorContext)
        }
        return { data: null, error: apiError }
      }
      
      return { data, error: null }
    } catch (error) {
      const apiError = this.handleError(error)
      if (options?.showToast !== false) {
        this.showError(apiError, options?.errorContext)
      }
      return { data: null, error: apiError }
    }
  }

  // Convenience method for mutations with success feedback
  async mutate<T>(
    mutationFn: () => Promise<{ data: T | null; error: PostgrestError | null }> | PromiseLike<{ data: T | null; error: PostgrestError | null }>,
    options?: {
      showToast?: boolean
      successMessage?: string
      errorContext?: string
    }
  ): Promise<ApiResult<T>> {
    const result = await this.query(mutationFn, {
      showToast: options?.showToast,
      errorContext: options?.errorContext
    })
    
    if (result.data && options?.successMessage && options?.showToast !== false) {
      toast.success(options.successMessage)
    }
    
    return result
  }

  // Get the raw Supabase client for advanced usage
  get client() {
    return this.supabase
  }
}

// Export singleton instance
export const api = new ApiClient()

// Helper for auth queries that need special handling
export const getAuthUser = async () => {
  const { data, error } = await api.client.auth.getUser()
  
  if (error || !data.user) {
    return { data: null, error: error || { message: 'No authenticated user' } }
  }
  
  return { data: { user: data.user }, error: null }
}

// Export convenience functions
export const handleApiError = (error: ApiError, context?: string) => {
  const message = context 
    ? `${context}: ${error.message}`
    : error.message
  
  toast.error(message)
  console.error('API Error:', error)
}

export const isApiError = <T>(result: ApiResult<T>): result is { data: null; error: ApiError } => {
  return result.error !== null
}