import { api, handleApiError, isApiError } from './client'
import { toast } from 'sonner'

// Mock dependencies
jest.mock('@/lib/supabase/client')
jest.mock('sonner', () => ({
  toast: {
    error: jest.fn(),
    success: jest.fn()
  }
}))

describe('API Client', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('query', () => {
    it('returns data on successful query', async () => {
      const mockData = { id: '1', name: 'Test' }
      const mockQueryFn = jest.fn().mockResolvedValue({ 
        data: mockData, 
        error: null 
      })

      const result = await api.query(mockQueryFn)

      expect(result).toEqual({ data: mockData, error: null })
      expect(mockQueryFn).toHaveBeenCalledTimes(1)
      expect(toast.error).not.toHaveBeenCalled()
    })

    it('handles PostgreSQL errors correctly', async () => {
      const pgError = {
        code: '23505',
        message: 'Duplicate key value',
        details: 'Key already exists'
      }
      const mockQueryFn = jest.fn().mockResolvedValue({ 
        data: null, 
        error: pgError 
      })

      const result = await api.query(mockQueryFn)

      expect(result).toEqual({
        data: null,
        error: {
          message: 'Duplicate key value',
          code: '23505',
          details: 'Key already exists'
        }
      })
      expect(toast.error).toHaveBeenCalledWith('Duplicate key value')
    })

    it('handles generic errors correctly', async () => {
      const error = new Error('Network error')
      const mockQueryFn = jest.fn().mockRejectedValue(error)

      const result = await api.query(mockQueryFn)

      expect(result).toEqual({
        data: null,
        error: {
          message: 'Network error'
        }
      })
      expect(toast.error).toHaveBeenCalledWith('Network error')
    })

    it('handles null data as error', async () => {
      const mockQueryFn = jest.fn().mockResolvedValue({ 
        data: null, 
        error: null 
      })

      const result = await api.query(mockQueryFn)

      expect(result).toEqual({
        data: null,
        error: {
          message: 'No data returned'
        }
      })
      expect(toast.error).toHaveBeenCalledWith('No data returned')
    })

    it('suppresses toast when showToast is false', async () => {
      const mockQueryFn = jest.fn().mockResolvedValue({ 
        data: null, 
        error: { message: 'Error occurred' } 
      })

      await api.query(mockQueryFn, { showToast: false })

      expect(toast.error).not.toHaveBeenCalled()
    })

    it('adds error context to toast message', async () => {
      const mockQueryFn = jest.fn().mockResolvedValue({ 
        data: null, 
        error: { message: 'Database error', code: 'P0001' } 
      })

      await api.query(mockQueryFn, { errorContext: 'Failed to fetch users' })

      expect(toast.error).toHaveBeenCalledWith('Failed to fetch users: Database error')
    })
  })

  describe('mutate', () => {
    it('shows success message on successful mutation', async () => {
      const mockData = { id: '1', created: true }
      const mockMutationFn = jest.fn().mockResolvedValue({ 
        data: mockData, 
        error: null 
      })

      const result = await api.mutate(mockMutationFn, {
        successMessage: 'Item created successfully'
      })

      expect(result).toEqual({ data: mockData, error: null })
      expect(toast.success).toHaveBeenCalledWith('Item created successfully')
    })

    it('does not show success message when showToast is false', async () => {
      const mockData = { id: '1' }
      const mockMutationFn = jest.fn().mockResolvedValue({ 
        data: mockData, 
        error: null 
      })

      await api.mutate(mockMutationFn, {
        successMessage: 'Success',
        showToast: false
      })

      expect(toast.success).not.toHaveBeenCalled()
      expect(toast.error).not.toHaveBeenCalled()
    })

    it('shows error but not success on failed mutation', async () => {
      const mockMutationFn = jest.fn().mockResolvedValue({ 
        data: null, 
        error: { message: 'Update failed', code: 'P0002' } 
      })

      const result = await api.mutate(mockMutationFn, {
        successMessage: 'Updated',
        errorContext: 'Failed to update item'
      })

      expect(result.error).toBeTruthy()
      expect(toast.error).toHaveBeenCalledWith('Failed to update item: Update failed')
      expect(toast.success).not.toHaveBeenCalled()
    })
  })

  describe('handleApiError', () => {
    it('shows error toast with message', () => {
      const error = { message: 'Something went wrong' }
      
      handleApiError(error)
      
      expect(toast.error).toHaveBeenCalledWith('Something went wrong')
    })

    it('adds context to error message', () => {
      const error = { message: 'Database connection failed' }
      
      handleApiError(error, 'Loading user data')
      
      expect(toast.error).toHaveBeenCalledWith('Loading user data: Database connection failed')
    })
  })

  describe('isApiError', () => {
    it('correctly identifies error results', () => {
      const errorResult = { data: null, error: { message: 'Error' } }
      const successResult = { data: { id: '1' }, error: null }

      expect(isApiError(errorResult)).toBe(true)
      expect(isApiError(successResult)).toBe(false)
    })
  })
})