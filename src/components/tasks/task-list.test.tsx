import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { TaskList } from './task-list'
import { useTaskStore } from '@/stores/task-store'
import { mockTask } from '@/test-utils/mocks'

// Mock the task store
jest.mock('@/stores/task-store')

// Mock framer-motion to avoid animation issues in tests
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    li: ({ children, ...props }: any) => <li {...props}>{children}</li>,
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}))

describe('TaskList', () => {
  const mockFetchTasks = jest.fn()
  const mockToggleTask = jest.fn()
  const mockSelectTask = jest.fn()
  const mockDeleteTask = jest.fn()

  const defaultMockState = {
    tasks: [],
    isLoading: false,
    error: null,
    fetchTasks: mockFetchTasks,
    toggleTask: mockToggleTask,
    selectTask: mockSelectTask,
    deleteTask: mockDeleteTask,
    selectedTaskId: null,
    clearError: jest.fn()
  }

  beforeEach(() => {
    jest.clearAllMocks()
    ;(useTaskStore as unknown as jest.Mock).mockReturnValue(defaultMockState)
  })

  it('renders loading state', () => {
    ;(useTaskStore as unknown as jest.Mock).mockReturnValue({
      ...defaultMockState,
      isLoading: true
    })

    render(<TaskList />)
    expect(screen.getByText('Loading tasks...')).toBeInTheDocument()
  })

  it('renders empty state when no tasks', async () => {
    render(<TaskList />)
    
    await waitFor(() => {
      expect(screen.getByText('No tasks yet')).toBeInTheDocument()
    })
  })

  it('renders task list', async () => {
    const tasks = [
      { ...mockTask, id: '1', title: 'Task 1' },
      { ...mockTask, id: '2', title: 'Task 2' }
    ]

    ;(useTaskStore as unknown as jest.Mock).mockReturnValue({
      ...defaultMockState,
      tasks
    })

    render(<TaskList />)
    
    await waitFor(() => {
      expect(screen.getByText('Task 1')).toBeInTheDocument()
      expect(screen.getByText('Task 2')).toBeInTheDocument()
    })
  })

  it('calls toggleTask when checkbox is clicked', async () => {
    const tasks = [{ ...mockTask, id: '1', title: 'Task 1' }]

    ;(useTaskStore as unknown as jest.Mock).mockReturnValue({
      ...defaultMockState,
      tasks
    })

    render(<TaskList />)
    
    const checkbox = screen.getByRole('checkbox')
    fireEvent.click(checkbox)
    
    expect(mockToggleTask).toHaveBeenCalledWith('1')
  })

  it('calls selectTask when task is clicked', async () => {
    const tasks = [{ ...mockTask, id: '1', title: 'Task 1' }]

    ;(useTaskStore as unknown as jest.Mock).mockReturnValue({
      ...defaultMockState,
      tasks
    })

    render(<TaskList />)
    
    const taskTitle = screen.getByText('Task 1')
    fireEvent.click(taskTitle)
    
    expect(mockSelectTask).toHaveBeenCalledWith('1')
  })

  it('shows completed tasks with strikethrough', async () => {
    const tasks = [
      { 
        ...mockTask, 
        id: '1', 
        title: 'Completed Task',
        status: 'completed' as const,
        completed_at: new Date().toISOString()
      }
    ]

    ;(useTaskStore as unknown as jest.Mock).mockReturnValue({
      ...defaultMockState,
      tasks
    })

    render(<TaskList />)
    
    const taskTitle = screen.getByText('Completed Task')
    expect(taskTitle).toHaveClass('line-through')
  })

  it('shows due date for tasks', async () => {
    const dueDate = new Date()
    dueDate.setDate(dueDate.getDate() + 1) // Tomorrow
    
    const tasks = [
      { 
        ...mockTask, 
        id: '1', 
        title: 'Task with due date',
        due_date: dueDate.toISOString()
      }
    ]

    ;(useTaskStore as unknown as jest.Mock).mockReturnValue({
      ...defaultMockState,
      tasks
    })

    render(<TaskList />)
    
    expect(screen.getByText(/Tomorrow/)).toBeInTheDocument()
  })

  it('fetches tasks on mount', () => {
    render(<TaskList />)
    expect(mockFetchTasks).toHaveBeenCalledTimes(1)
  })

  it('shows error state', async () => {
    const error = { message: 'Failed to load tasks' }

    ;(useTaskStore as unknown as jest.Mock).mockReturnValue({
      ...defaultMockState,
      error
    })

    render(<TaskList />)
    
    expect(screen.getByText(/Failed to load tasks/)).toBeInTheDocument()
  })
})