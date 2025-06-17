import { renderHook, act } from '@testing-library/react'
import { useTaskStore } from './task-store'
import { api, isApiError } from '@/lib/api/client'
import { mockTask } from '@/test-utils/mocks'

// Mock the API client
jest.mock('@/lib/api/client', () => ({
  api: {
    query: jest.fn(),
    mutate: jest.fn(),
    client: {
      from: jest.fn(() => ({
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        or: jest.fn().mockReturnThis(),
        order: jest.fn().mockReturnThis()
      })),
      auth: {
        getUser: jest.fn()
      }
    }
  },
  isApiError: jest.fn()
}))

describe('Task Store', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    // Reset store state
    useTaskStore.setState({
      tasks: [],
      isLoading: false,
      selectedTaskId: null,
      error: null
    })
  })

  describe('updateTask', () => {
    it('updates task successfully', async () => {
      const existingTask = { ...mockTask, id: '1', title: 'Original' }
      const updates = { title: 'Updated Title' }

      ;(api.mutate as jest.Mock).mockResolvedValueOnce({
        data: { ...existingTask, ...updates },
        error: null
      })
      ;(isApiError as jest.Mock).mockReturnValue(false)

      const { result } = renderHook(() => useTaskStore())
      
      act(() => {
        useTaskStore.setState({ tasks: [existingTask] })
      })

      await act(async () => {
        await result.current.updateTask('1', updates)
      })

      expect(result.current.tasks[0].title).toBe('Updated Title')
    })

    it('handles update error', async () => {
      const mockError = { message: 'Update failed' }

      ;(api.mutate as jest.Mock).mockResolvedValueOnce({
        data: null,
        error: mockError
      })
      ;(isApiError as jest.Mock).mockReturnValue(true)

      const { result } = renderHook(() => useTaskStore())
      
      act(() => {
        useTaskStore.setState({ tasks: [mockTask] })
      })

      await act(async () => {
        await result.current.updateTask('1', { title: 'New' })
      })

      expect(result.current.error).toEqual(mockError)
    })
  })

  describe('deleteTask', () => {
    it('deletes task successfully', async () => {
      ;(api.mutate as jest.Mock).mockResolvedValueOnce({
        data: {},
        error: null
      })
      ;(isApiError as jest.Mock).mockReturnValue(false)

      const { result } = renderHook(() => useTaskStore())
      
      act(() => {
        useTaskStore.setState({ tasks: [
          { ...mockTask, id: '1' },
          { ...mockTask, id: '2' }
        ]})
      })

      await act(async () => {
        await result.current.deleteTask('1')
      })

      expect(result.current.tasks).toHaveLength(1)
      expect(result.current.tasks[0].id).toBe('2')
    })
  })

  describe('toggleTask', () => {
    it('toggles task completion status', async () => {
      const task = { ...mockTask, id: '1', status: 'active' as const }

      ;(api.mutate as jest.Mock).mockResolvedValueOnce({
        data: { ...task, status: 'completed' as const, completed_at: new Date().toISOString() },
        error: null
      })
      ;(isApiError as jest.Mock).mockReturnValue(false)

      const { result } = renderHook(() => useTaskStore())
      
      act(() => {
        useTaskStore.setState({ tasks: [task] })
      })

      await act(async () => {
        await result.current.toggleTask('1')
      })

      expect(result.current.tasks[0].status).toBe('completed')
      expect(result.current.tasks[0].completed_at).toBeTruthy()
    })

    it('uncompletes a completed task', async () => {
      const completedTask = { 
        ...mockTask, 
        id: '1', 
        status: 'completed' as const,
        completed_at: new Date().toISOString()
      }

      const activeTask = { ...completedTask, status: 'active' as const, completed_at: null }

      ;(api.mutate as jest.Mock).mockResolvedValueOnce({
        data: activeTask,
        error: null
      })
      ;(isApiError as jest.Mock).mockReturnValue(false)

      const { result } = renderHook(() => useTaskStore())
      
      act(() => {
        useTaskStore.setState({ tasks: [completedTask] })
      })

      await act(async () => {
        await result.current.toggleTask('1')
      })

      expect(result.current.tasks[0].status).toBe('active')
      expect(result.current.tasks[0].completed_at).toBeNull()
    })
  })

  describe('task selection', () => {
    it('selects and clears task selection', () => {
      const { result } = renderHook(() => useTaskStore())

      act(() => {
        result.current.selectTask('task-1')
      })

      expect(result.current.selectedTaskId).toBe('task-1')

      act(() => {
        result.current.selectTask(null)
      })

      expect(result.current.selectedTaskId).toBeNull()
    })
  })

  describe('error handling', () => {
    it('clears error', () => {
      const { result } = renderHook(() => useTaskStore())

      act(() => {
        useTaskStore.setState({ error: { message: 'Some error' } })
      })

      expect(result.current.error).toEqual({ message: 'Some error' })

      act(() => {
        result.current.clearError()
      })

      expect(result.current.error).toBeNull()
    })
  })
})