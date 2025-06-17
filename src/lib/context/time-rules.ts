export type TimeOfDay = 'morning' | 'afternoon' | 'evening' | 'night'
export type DayType = 'weekday' | 'weekend' | 'holiday'

export interface TimeWindow {
  name: string
  timeOfDay: TimeOfDay
  startHour: number
  endHour: number
}

export interface TimeRule {
  id: string
  name: string
  enabled: boolean
  timeWindows: TimeWindow[]
  dayTypes: DayType[]
  excludeDates?: string[] // ISO date strings
}

export const DEFAULT_TIME_WINDOWS: TimeWindow[] = [
  { name: 'Early Morning', timeOfDay: 'morning', startHour: 5, endHour: 8 },
  { name: 'Morning', timeOfDay: 'morning', startHour: 8, endHour: 12 },
  { name: 'Afternoon', timeOfDay: 'afternoon', startHour: 12, endHour: 17 },
  { name: 'Evening', timeOfDay: 'evening', startHour: 17, endHour: 21 },
  { name: 'Night', timeOfDay: 'night', startHour: 21, endHour: 24 },
  { name: 'Late Night', timeOfDay: 'night', startHour: 0, endHour: 5 }
]

export class TimeRules {
  private holidays: Set<string> = new Set([
    '2024-01-01', // New Year's Day
    '2024-07-04', // Independence Day
    '2024-12-25', // Christmas
    // Add more holidays as needed
  ])

  getCurrentTimeOfDay(): TimeOfDay {
    const hour = new Date().getHours()
    
    if (hour >= 5 && hour < 12) return 'morning'
    if (hour >= 12 && hour < 17) return 'afternoon'
    if (hour >= 17 && hour < 21) return 'evening'
    return 'night'
  }

  getCurrentDayType(): DayType {
    const now = new Date()
    const dayOfWeek = now.getDay()
    const dateStr = now.toISOString().split('T')[0]
    
    if (this.holidays.has(dateStr)) return 'holiday'
    if (dayOfWeek === 0 || dayOfWeek === 6) return 'weekend'
    return 'weekday'
  }

  isBusinessHours(): boolean {
    const now = new Date()
    const hour = now.getHours()
    const dayType = this.getCurrentDayType()
    
    return dayType === 'weekday' && hour >= 9 && hour < 17
  }

  getActiveTimeWindows(): TimeWindow[] {
    const hour = new Date().getHours()
    return DEFAULT_TIME_WINDOWS.filter(
      window => hour >= window.startHour && hour < window.endHour
    )
  }

  matchesTimeRule(rule: TimeRule): boolean {
    if (!rule.enabled) return false
    
    const currentDayType = this.getCurrentDayType()
    const currentTimeOfDay = this.getCurrentTimeOfDay()
    const currentDate = new Date().toISOString().split('T')[0]
    
    // Check excluded dates
    if (rule.excludeDates?.includes(currentDate)) return false
    
    // Check day type
    if (!rule.dayTypes.includes(currentDayType)) return false
    
    // Check time windows
    const activeWindows = this.getActiveTimeWindows()
    return rule.timeWindows.some(ruleWindow =>
      activeWindows.some(activeWindow =>
        activeWindow.timeOfDay === ruleWindow.timeOfDay &&
        activeWindow.startHour >= ruleWindow.startHour &&
        activeWindow.endHour <= ruleWindow.endHour
      )
    )
  }

  getOptimalTimeForEnergy(energyLevel: 'low' | 'medium' | 'high'): TimeOfDay[] {
    const currentHour = new Date().getHours()
    
    switch (energyLevel) {
      case 'high':
        // High energy tasks best in morning or early afternoon
        if (currentHour < 14) return ['morning', 'afternoon']
        return ['morning'] // Suggest for tomorrow morning
        
      case 'medium':
        // Medium energy tasks throughout the day
        return ['morning', 'afternoon', 'evening']
        
      case 'low':
        // Low energy tasks anytime, but especially good for end of day
        if (currentHour >= 15) return ['evening', 'afternoon']
        return ['afternoon', 'evening', 'night']
    }
  }

  addHoliday(date: string): void {
    this.holidays.add(date)
  }

  removeHoliday(date: string): void {
    this.holidays.delete(date)
  }

  isHoliday(date: Date): boolean {
    const dateStr = date.toISOString().split('T')[0]
    return this.holidays.has(dateStr)
  }
}