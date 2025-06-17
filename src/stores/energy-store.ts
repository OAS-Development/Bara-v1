import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type EnergyLevel = 'low' | 'medium' | 'high'

export interface EnergyRecord {
  timestamp: string
  level: EnergyLevel
  note?: string
}

interface EnergyState {
  currentLevel: EnergyLevel
  history: EnergyRecord[]
  lastUpdated: string | null
  
  // Actions
  setEnergyLevel: (level: EnergyLevel, note?: string) => void
  getAverageEnergyForTimeOfDay: (timeOfDay: string) => EnergyLevel | null
  getEnergyTrend: () => 'improving' | 'declining' | 'stable'
  clearHistory: () => void
}

const HISTORY_LIMIT = 100 // Keep last 100 energy records

export const useEnergyStore = create<EnergyState>()(
  persist(
    (set, get) => ({
      currentLevel: 'medium',
      history: [],
      lastUpdated: null,

      setEnergyLevel: (level, note) => {
        const timestamp = new Date().toISOString()
        const record: EnergyRecord = { timestamp, level, note }
        
        set(state => ({
          currentLevel: level,
          lastUpdated: timestamp,
          history: [...state.history.slice(-HISTORY_LIMIT + 1), record]
        }))
      },

      getAverageEnergyForTimeOfDay: (timeOfDay) => {
        const { history } = get()
        if (history.length === 0) return null
        
        const relevantRecords = history.filter(record => {
          const hour = new Date(record.timestamp).getHours()
          switch (timeOfDay) {
            case 'morning': return hour >= 5 && hour < 12
            case 'afternoon': return hour >= 12 && hour < 17
            case 'evening': return hour >= 17 && hour < 21
            case 'night': return hour >= 21 || hour < 5
            default: return false
          }
        })
        
        if (relevantRecords.length === 0) return null
        
        const energyScores = relevantRecords.map(r => {
          switch (r.level) {
            case 'high': return 3
            case 'medium': return 2
            case 'low': return 1
          }
        })
        
        const avgScore = energyScores.reduce((a, b) => a + b, 0) / energyScores.length
        
        if (avgScore >= 2.5) return 'high'
        if (avgScore >= 1.5) return 'medium'
        return 'low'
      },

      getEnergyTrend: () => {
        const { history } = get()
        if (history.length < 5) return 'stable'
        
        const recent = history.slice(-5)
        const older = history.slice(-10, -5)
        
        const scoreRecord = (record: EnergyRecord) => {
          switch (record.level) {
            case 'high': return 3
            case 'medium': return 2
            case 'low': return 1
          }
        }
        
        const recentAvg = recent.reduce((sum, r) => sum + scoreRecord(r), 0) / recent.length
        const olderAvg = older.reduce((sum, r) => sum + scoreRecord(r), 0) / older.length
        
        if (recentAvg > olderAvg + 0.3) return 'improving'
        if (recentAvg < olderAvg - 0.3) return 'declining'
        return 'stable'
      },

      clearHistory: () => {
        set({ history: [], lastUpdated: null })
      }
    }),
    {
      name: 'energy-storage',
      partialize: (state) => ({
        currentLevel: state.currentLevel,
        history: state.history.slice(-50), // Only persist last 50 records
        lastUpdated: state.lastUpdated
      })
    }
  )
)