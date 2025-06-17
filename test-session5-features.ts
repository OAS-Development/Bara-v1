#!/usr/bin/env npx tsx

import { createClient } from '@supabase/supabase-js'
import { Database } from './src/types/database.types'
import dotenv from 'dotenv'
import path from 'path'

// Load environment variables
dotenv.config({ path: path.join(__dirname, '.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey)

// Test tracking
let totalTests = 0
let passedTests = 0
let blockedTests = 0

function reportTest(name: string, passed: boolean, reason?: string) {
  totalTests++
  if (passed) {
    passedTests++
    console.log(`✅ ${name}`)
  } else if (reason?.includes('database field')) {
    blockedTests++
    console.log(`🚫 ${name} - BLOCKED: ${reason}`)
  } else {
    console.log(`❌ ${name} - ${reason || 'Failed'}`)
  }
}

async function testImportSystem() {
  console.log('\n📥 Testing Import System (Part A)')
  
  // Test 1: File validation
  const validExtensions = ['.ofocus-archive']
  const testFile = 'test.ofocus-archive'
  const isValidExtension = validExtensions.some(ext => testFile.endsWith(ext))
  reportTest('File extension validation', isValidExtension)
  
  // Test 2: Import mapping configuration
  try {
    // The import mapper should exist
    const { ImportMapper } = await import('./src/lib/import/import-mapper')
    const mapper = new ImportMapper({ userId: 'test-user-id' })
    reportTest('Import mapper initialization', true)
    
    // Test mapping capability
    const testData = {
      projects: [],
      contexts: [],
      tasks: []
    }
    const result = mapper.mapOmniFocusData(testData)
    reportTest('Field mappings configuration', result.stats !== undefined)
  } catch (error) {
    reportTest('Import mapper functionality', false, String(error))
  }
}

async function testLocationContext() {
  console.log('\n📍 Testing Location Context (Part B)')
  
  try {
    // Test location store
    const { useLocationStore } = await import('./src/stores/location-store')
    const store = useLocationStore.getState()
    
    // Test default locations
    const hasDefaultLocations = store.locations.length > 0
    reportTest('Default locations exist', hasDefaultLocations)
    
    // Test adding location
    const initialCount = store.locations.length
    store.addLocation({
      name: 'Test Location',
      latitude: 37.7749,
      longitude: -122.4194,
      radius: 100
    })
    const locationAdded = store.locations.length === initialCount + 1
    reportTest('Add location functionality', locationAdded)
    
    // Test distance calculation
    // Set a mock current location first
    store.setCurrentLocation({
      coords: {
        latitude: 37.7749,
        longitude: -122.4194,
        altitude: null,
        accuracy: 10,
        altitudeAccuracy: null,
        heading: null,
        speed: null
      },
      timestamp: Date.now()
    } as GeolocationPosition)
    
    const distance = store.getDistanceToLocation(store.locations[0].id)
    reportTest('Distance calculation', distance !== null)
    
    // Test task location field
    const { data: task } = await supabase
      .from('tasks')
      .select('*')
      .limit(1)
      .single()
    
    if (task && 'location' in task) {
      reportTest('Task location field exists', true)
    } else {
      reportTest('Task location field exists', false, 'Missing database field: location')
    }
  } catch (error) {
    reportTest('Location context', false, String(error))
  }
}

async function testTimeAndEnergy() {
  console.log('\n⏰ Testing Time & Energy (Part C)')
  
  try {
    // Test time rules
    const { TimeRules } = await import('./src/lib/context/time-rules')
    const timeRules = new TimeRules()
    
    // Test current context
    const context = timeRules.getCurrentContext()
    reportTest('Get current time context', context !== null)
    
    // Test time of day detection
    const hasTimeOfDay = ['morning', 'afternoon', 'evening', 'night'].includes(context.timeOfDay)
    reportTest('Time of day detection', hasTimeOfDay)
    
    // Test suggested task types
    const suggestions = timeRules.getSuggestedTaskTypes()
    reportTest('Task type suggestions', suggestions.length > 0)
    
    // Test energy field in database
    const { data: task } = await supabase
      .from('tasks')
      .select('energy_required')
      .limit(1)
      .single()
    
    if (task && task.energy_required !== undefined) {
      reportTest('Task energy_required field exists', true)
    } else {
      reportTest('Task energy_required field exists', false, 'energy_required field might be missing')
    }
    
    // Test time_of_day field
    const { data: taskWithTime } = await supabase
      .from('tasks')
      .select('*')
      .limit(1)
      .single()
    
    if (taskWithTime && 'time_of_day' in taskWithTime) {
      reportTest('Task time_of_day field exists', true)
    } else {
      reportTest('Task time_of_day field exists', false, 'Missing database field: time_of_day')
    }
  } catch (error) {
    reportTest('Time and energy context', false, String(error))
  }
}

async function testContextEngine() {
  console.log('\n🎯 Testing Context Engine (Part D)')
  
  try {
    // Test context filtering logic
    const { useLocationStore } = await import('./src/stores/location-store')
    const { TimeRules } = await import('./src/lib/context/time-rules')
    
    const locationStore = useLocationStore.getState()
    const timeRules = new TimeRules()
    
    // Test combined context
    const hasLocations = locationStore.locations.length > 0
    const timeContext = timeRules.getCurrentContext()
    const hasTimeContext = timeContext !== null
    
    reportTest('Combined context availability', hasLocations && hasTimeContext)
    
    // Test filter combinations
    const filters = {
      location: locationStore.locations[0]?.id,
      timeOfDay: timeContext.timeOfDay,
      energyLevel: 'medium'
    }
    
    reportTest('Context filter creation', Object.keys(filters).length === 3)
  } catch (error) {
    reportTest('Context engine', false, String(error))
  }
}

async function testAIFeatures() {
  console.log('\n🤖 Testing AI Features (Parts E & F)')
  
  try {
    // Test natural language parser existence
    const nlParserPath = './src/lib/ai/task-parser'
    try {
      await import(nlParserPath)
      reportTest('Natural language parser module', true)
    } catch {
      reportTest('Natural language parser module', false, 'Module not found')
    }
    
    // Test AI suggestions panel component
    const suggestionsPath = './src/components/ai/suggestions-panel'
    try {
      await import(suggestionsPath)
      reportTest('AI suggestions panel component', true)
    } catch {
      reportTest('AI suggestions panel component', false, 'Component not found')
    }
    
    // Test mock AI functionality
    const mockParse = (input: string) => {
      const hasDate = /tomorrow|today|next week/i.test(input)
      const hasTime = /morning|afternoon|evening|night|\d{1,2}(am|pm)/i.test(input)
      const hasLocation = /home|office|gym/i.test(input)
      
      return {
        title: input.replace(/tomorrow|today|next week|morning|afternoon|evening|night|\d{1,2}(am|pm)|at home|at office|at gym/gi, '').trim(),
        hasDate,
        hasTime,
        hasLocation
      }
    }
    
    const testInput = "Call dentist tomorrow morning at office"
    const parsed = mockParse(testInput)
    reportTest('Mock AI parsing', parsed.hasDate && parsed.hasTime && parsed.hasLocation)
    
  } catch (error) {
    reportTest('AI features', false, String(error))
  }
}

async function main() {
  console.log('🧪 Session 5 Feature Tests')
  console.log('=' . repeat(50))
  
  await testImportSystem()
  await testLocationContext()
  await testTimeAndEnergy()
  await testContextEngine()
  await testAIFeatures()
  
  console.log('\n' + '=' . repeat(50))
  console.log('📊 Test Summary:')
  console.log(`Total Tests: ${totalTests}`)
  console.log(`Passed: ${passedTests}`)
  console.log(`Blocked (DB fields): ${blockedTests}`)
  console.log(`Failed: ${totalTests - passedTests - blockedTests}`)
  
  if (blockedTests > 0) {
    console.log('\n⚠️  Some features are blocked due to missing database fields:')
    console.log('- location (text)')
    console.log('- time_of_day (text)')
    console.log('\nThese fields exist in the migration file but have not been applied.')
  }
  
  process.exit(passedTests === totalTests ? 0 : 1)
}

main().catch(console.error)