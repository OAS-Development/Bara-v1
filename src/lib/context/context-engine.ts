import { TimeRules, TimeOfDay } from './time-rules'
import { DeviceContext, DeviceDetector } from './device-context'
import { useLocationStore } from '@/stores/location-store'
import { useEnergyStore, EnergyLevel } from '@/stores/energy-store'
import { Task } from '@/types'

export interface ContextScore {
  taskId: string
  score: number
  reasons: string[]
}

export interface CombinedContext {
  location: string | null
  timeOfDay: TimeOfDay
  energyLevel: EnergyLevel
  device: DeviceContext
  isBusinessHours: boolean
  nearbyLocationId: string | null
}

export class ContextEngine {
  private timeRules = new TimeRules()
  private deviceDetector = new DeviceDetector()

  async getCurrentContext(): Promise<CombinedContext> {
    const locationStore = useLocationStore.getState()
    const energyStore = useEnergyStore.getState()
    const deviceContext = await this.deviceDetector.getCurrentContext()

    return {
      location: locationStore.nearbyLocationId,
      timeOfDay: this.timeRules.getCurrentTimeOfDay(),
      energyLevel: energyStore.currentLevel,
      device: deviceContext,
      isBusinessHours: this.timeRules.isBusinessHours(),
      nearbyLocationId: locationStore.nearbyLocationId
    }
  }

  scoreTaskForContext(task: Task & { 
    location?: string | null
    time_of_day?: TimeOfDay | null
    energy_required?: EnergyLevel | null
  }, context: CombinedContext): ContextScore {
    let score = 50 // Base score
    const reasons: string[] = []

    // Location matching (0-30 points)
    if (task.location) {
      if (task.location === context.nearbyLocationId) {
        score += 30
        reasons.push('At required location')
      } else {
        score -= 20
        reasons.push('Wrong location')
      }
    } else if (context.nearbyLocationId) {
      score += 5
      reasons.push('Location-independent task')
    }

    // Time of day matching (0-25 points)
    if (task.time_of_day) {
      if (task.time_of_day === context.timeOfDay) {
        score += 25
        reasons.push('Perfect time match')
      } else {
        const timeCompatibility = this.getTimeCompatibility(task.time_of_day, context.timeOfDay)
        score += timeCompatibility * 15
        if (timeCompatibility > 0) {
          reasons.push('Acceptable time')
        } else {
          reasons.push('Wrong time of day')
        }
      }
    }

    // Energy level matching (0-25 points)
    if (task.energy_required) {
      const energyMatch = this.getEnergyMatch(task.energy_required, context.energyLevel)
      score += energyMatch * 25
      
      if (energyMatch === 1) {
        reasons.push('Energy level matches')
      } else if (energyMatch > 0.5) {
        reasons.push('Manageable energy requirement')
      } else {
        reasons.push('Energy mismatch')
      }
    }

    // Due date urgency (0-20 points)
    if (task.due_date) {
      const hoursUntilDue = (new Date(task.due_date).getTime() - Date.now()) / (1000 * 60 * 60)
      if (hoursUntilDue < 24) {
        score += 20
        reasons.push('Due soon')
      } else if (hoursUntilDue < 72) {
        score += 10
        reasons.push('Due this week')
      }
    }

    // Device context adjustments
    if (context.device.type === 'mobile' && task.notes && task.notes.length > 500) {
      score -= 10
      reasons.push('Long task for mobile')
    }

    // Business hours preference
    if (context.isBusinessHours && task.tags?.includes('work')) {
      score += 10
      reasons.push('Work task during business hours')
    }

    // Ensure score is between 0 and 100
    score = Math.max(0, Math.min(100, score))

    return {
      taskId: task.id,
      score,
      reasons
    }
  }

  private getTimeCompatibility(preferred: TimeOfDay, current: TimeOfDay): number {
    const compatibility = {
      morning: { morning: 1, afternoon: 0.5, evening: 0, night: 0 },
      afternoon: { morning: 0.3, afternoon: 1, evening: 0.5, night: 0 },
      evening: { morning: 0, afternoon: 0.3, evening: 1, night: 0.5 },
      night: { morning: 0, afternoon: 0, evening: 0.3, night: 1 }
    }
    
    return compatibility[preferred][current]
  }

  private getEnergyMatch(required: EnergyLevel, current: EnergyLevel): number {
    const levels = { low: 1, medium: 2, high: 3 }
    const requiredLevel = levels[required]
    const currentLevel = levels[current]
    
    if (currentLevel >= requiredLevel) return 1
    if (currentLevel === requiredLevel - 1) return 0.6
    return 0.2
  }

  sortTasksByContext(tasks: Task[], context: CombinedContext): Task[] {
    const scores = tasks.map(task => this.scoreTaskForContext(task, context))
    
    return [...tasks].sort((a, b) => {
      const scoreA = scores.find(s => s.taskId === a.id)?.score || 0
      const scoreB = scores.find(s => s.taskId === b.id)?.score || 0
      return scoreB - scoreA
    })
  }

  getContextSuggestions(context: CombinedContext): string[] {
    const suggestions: string[] = []

    // Energy-based suggestions
    if (context.energyLevel === 'low') {
      suggestions.push('Focus on simple, routine tasks')
      suggestions.push('Consider taking a break soon')
    } else if (context.energyLevel === 'high') {
      suggestions.push('Good time for complex problem-solving')
      suggestions.push('Tackle your most challenging tasks')
    }

    // Time-based suggestions
    if (context.timeOfDay === 'morning') {
      suggestions.push('Start with high-priority tasks')
    } else if (context.timeOfDay === 'evening') {
      suggestions.push('Wind down with planning for tomorrow')
    }

    // Location-based suggestions
    if (!context.nearbyLocationId) {
      suggestions.push('Set up location contexts for better task filtering')
    }

    // Device-based suggestions
    if (context.device.type === 'mobile') {
      suggestions.push('Quick tasks work best on mobile')
    }

    return suggestions
  }

  // Learn from user behavior
  recordTaskCompletion(task: Task, context: CombinedContext): void {
    // This would typically save to a database
    // For now, we'll just log it
    console.log('Task completed in context:', {
      taskType: task.tags?.join(','),
      context: {
        time: context.timeOfDay,
        energy: context.energyLevel,
        location: context.nearbyLocationId
      }
    })
  }
}