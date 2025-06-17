export interface TimeWindow {
  id: string
  name: string
  startHour: number
  endHour: number
  daysOfWeek: number[] // 0 = Sunday, 6 = Saturday
  icon?: string
}

export interface TimeContext {
  currentWindow: TimeWindow | null
  isBusinessHours: boolean
  isWeekend: boolean
  timeOfDay: 'morning' | 'afternoon' | 'evening' | 'night'
}

const defaultTimeWindows: TimeWindow[] = [
  {
    id: 'morning',
    name: 'Morning',
    startHour: 6,
    endHour: 12,
    daysOfWeek: [0, 1, 2, 3, 4, 5, 6],
    icon: '🌅'
  },
  {
    id: 'afternoon',
    name: 'Afternoon',
    startHour: 12,
    endHour: 17,
    daysOfWeek: [0, 1, 2, 3, 4, 5, 6],
    icon: '☀️'
  },
  {
    id: 'evening',
    name: 'Evening',
    startHour: 17,
    endHour: 22,
    daysOfWeek: [0, 1, 2, 3, 4, 5, 6],
    icon: '🌆'
  },
  {
    id: 'night',
    name: 'Night',
    startHour: 22,
    endHour: 6,
    daysOfWeek: [0, 1, 2, 3, 4, 5, 6],
    icon: '🌙'
  },
  {
    id: 'business-hours',
    name: 'Business Hours',
    startHour: 9,
    endHour: 17,
    daysOfWeek: [1, 2, 3, 4, 5], // Monday to Friday
    icon: '💼'
  }
]

export class TimeRules {
  private windows: TimeWindow[]
  
  constructor(customWindows?: TimeWindow[]) {
    this.windows = customWindows || defaultTimeWindows
  }
  
  getCurrentTimeOfDay(): 'morning' | 'afternoon' | 'evening' | 'night' {
    const hour = new Date().getHours()
    return this.getTimeOfDay(hour)
  }

  getCurrentContext(date: Date = new Date()): TimeContext {
    const hour = date.getHours()
    const dayOfWeek = date.getDay()
    
    // Find matching time windows
    const currentWindow = this.findCurrentWindow(date)
    
    // Check if business hours
    const businessHoursWindow = this.windows.find(w => w.id === 'business-hours')
    const isBusinessHours = businessHoursWindow ? 
      this.isInWindow(date, businessHoursWindow) : false
    
    // Check if weekend
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6
    
    // Determine time of day
    const timeOfDay = this.getTimeOfDay(hour)
    
    return {
      currentWindow,
      isBusinessHours,
      isWeekend,
      timeOfDay
    }
  }

  findCurrentWindow(date: Date = new Date()): TimeWindow | null {
    for (const window of this.windows) {
      if (this.isInWindow(date, window)) {
        return window
      }
    }
    return null
  }

  isInWindow(date: Date, window: TimeWindow): boolean {
    const hour = date.getHours()
    const dayOfWeek = date.getDay()
    
    // Check day of week
    if (!window.daysOfWeek.includes(dayOfWeek)) {
      return false
    }
    
    // Check time range
    if (window.startHour < window.endHour) {
      // Normal range (e.g., 9 AM to 5 PM)
      return hour >= window.startHour && hour < window.endHour
    } else {
      // Overnight range (e.g., 10 PM to 6 AM)
      return hour >= window.startHour || hour < window.endHour
    }
  }

  private getTimeOfDay(hour: number): 'morning' | 'afternoon' | 'evening' | 'night' {
    if (hour >= 6 && hour < 12) return 'morning'
    if (hour >= 12 && hour < 17) return 'afternoon'
    if (hour >= 17 && hour < 22) return 'evening'
    return 'night'
  }

  // Check if a specific date/time matches a rule
  matchesRule(date: Date, ruleId: string): boolean {
    const window = this.windows.find(w => w.id === ruleId)
    return window ? this.isInWindow(date, window) : false
  }

  // Get all active windows for a given time
  getActiveWindows(date: Date = new Date()): TimeWindow[] {
    return this.windows.filter(window => this.isInWindow(date, window))
  }

  // Check if it's a good time for a specific task type
  isGoodTimeFor(taskType: 'focus' | 'routine' | 'communication' | 'break'): boolean {
    const context = this.getCurrentContext()
    
    switch (taskType) {
      case 'focus':
        // Best in morning or early afternoon, not late night
        return context.timeOfDay === 'morning' || 
               (context.timeOfDay === 'afternoon' && new Date().getHours() < 15)
      
      case 'routine':
        // Good anytime except late night
        return context.timeOfDay !== 'night'
      
      case 'communication':
        // Best during business hours
        return context.isBusinessHours
      
      case 'break':
        // Always good time for a break!
        return true
      
      default:
        return true
    }
  }

  // Get suggested task types for current time
  getSuggestedTaskTypes(): string[] {
    const context = this.getCurrentContext()
    const suggestions: string[] = []
    
    if (context.timeOfDay === 'morning') {
      suggestions.push('focus', 'planning', 'creative')
    } else if (context.timeOfDay === 'afternoon') {
      suggestions.push('meetings', 'communication', 'routine')
    } else if (context.timeOfDay === 'evening') {
      suggestions.push('review', 'planning', 'learning')
    } else {
      suggestions.push('rest', 'light-tasks')
    }
    
    if (context.isWeekend) {
      suggestions.push('personal', 'hobbies')
    }
    
    return suggestions
  }
}