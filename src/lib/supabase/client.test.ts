import { createClient } from './client'

// Mock window.location
delete (window as any).location
window.location = { reload: jest.fn() } as any

describe('Supabase Client', () => {
  it('creates a client instance', () => {
    const client = createClient()
    
    expect(client).toBeDefined()
    expect(client.auth).toBeDefined()
    expect(client.from).toBeDefined()
  })

  it('returns the same instance on multiple calls', () => {
    const client1 = createClient()
    const client2 = createClient()
    
    expect(client1).toBe(client2)
  })

  it('has auth methods available', () => {
    const client = createClient()
    
    expect(typeof client.auth.getUser).toBe('function')
    expect(typeof client.auth.signIn).toBe('function')
    expect(typeof client.auth.signOut).toBe('function')
    expect(typeof client.auth.onAuthStateChange).toBe('function')
  })

  it('has database methods available', () => {
    const client = createClient()
    
    expect(typeof client.from).toBe('function')
    
    const tasksTable = client.from('tasks')
    expect(tasksTable).toBeDefined()
    expect(typeof tasksTable.select).toBe('function')
    expect(typeof tasksTable.insert).toBe('function')
    expect(typeof tasksTable.update).toBe('function')
    expect(typeof tasksTable.delete).toBe('function')
  })
})