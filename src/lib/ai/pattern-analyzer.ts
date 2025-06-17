import { TaskWithTags } from '@/types'
import { TimeOfDay } from '@/lib/context/time-rules'
import { EnergyLevel } from '@/stores/energy-store'

export interface TaskPattern {
  type: 'completion' | 'deferral' | 'abandonment'
  timeOfDay: TimeOfDay
  dayOfWeek: number
  energyLevel?: EnergyLevel
  location?: string
  tags: string[]
  projectId?: string
  completionTime?: number // minutes
}

export interface PatternInsight {
  pattern: string
  confidence: number
  dataPoints: number
  recommendation?: string
}

export interface ProjectVelocity {
  projectId: string
  projectName: string
  tasksPerWeek: number
  averageCompletionTime: number
  trend: 'increasing' | 'decreasing' | 'stable'
}

export class PatternAnalyzer {
  private patterns: TaskPattern[] = []
  private readonly MIN_DATA_POINTS = 5

  recordTaskCompletion(
    task: TaskWithTags,
    context: {
      timeOfDay: TimeOfDay
      energyLevel: EnergyLevel
      location?: string
    }
  ) {
    const completionTime =
      task.completed_at && task.created_at
        ? (new Date(task.completed_at).getTime() - new Date(task.created_at).getTime()) /
          (1000 * 60)
        : undefined

    this.patterns.push({
      type: 'completion',
      timeOfDay: context.timeOfDay,
      dayOfWeek: new Date().getDay(),
      energyLevel: context.energyLevel,
      location: context.location,
      tags: task.tags || [],
      projectId: task.project_id || undefined,
      completionTime
    })

    // Keep only recent patterns (last 1000)
    if (this.patterns.length > 1000) {
      this.patterns = this.patterns.slice(-1000)
    }
  }

  analyzeTimePatterns(): PatternInsight[] {
    const insights: PatternInsight[] = []
    const timeGroups = this.groupByTimeOfDay()

    for (const [time, patterns] of Object.entries(timeGroups)) {
      if (patterns.length >= this.MIN_DATA_POINTS) {
        const completionRate =
          patterns.filter((p) => p.type === 'completion').length / patterns.length

        if (completionRate > 0.8) {
          insights.push({
            pattern: `High productivity in the ${time}`,
            confidence: completionRate,
            dataPoints: patterns.length,
            recommendation: `Schedule important tasks for ${time}`
          })
        }
      }
    }

    return insights
  }

  analyzeEnergyPatterns(): PatternInsight[] {
    const insights: PatternInsight[] = []
    const energyGroups = this.groupByEnergy()

    for (const [energy, patterns] of Object.entries(energyGroups)) {
      const avgCompletionTime = this.calculateAverageCompletionTime(patterns)

      if (patterns.length >= this.MIN_DATA_POINTS && avgCompletionTime) {
        insights.push({
          pattern: `${energy} energy tasks take ~${Math.round(avgCompletionTime)} minutes`,
          confidence: 0.75,
          dataPoints: patterns.length
        })
      }
    }

    // Analyze energy-time correlations
    const morningHighEnergy = this.patterns.filter(
      (p) => p.timeOfDay === 'morning' && p.energyLevel === 'high' && p.type === 'completion'
    ).length

    const totalMorning = this.patterns.filter((p) => p.timeOfDay === 'morning').length

    if (totalMorning >= this.MIN_DATA_POINTS && morningHighEnergy / totalMorning > 0.6) {
      insights.push({
        pattern: 'High-energy tasks succeed in mornings',
        confidence: morningHighEnergy / totalMorning,
        dataPoints: totalMorning,
        recommendation: 'Reserve mornings for complex work'
      })
    }

    return insights
  }

  analyzeProjectVelocity(): ProjectVelocity[] {
    const projectGroups = this.groupByProject()
    const velocities: ProjectVelocity[] = []

    for (const [projectId, patterns] of Object.entries(projectGroups)) {
      if (!projectId || patterns.length < this.MIN_DATA_POINTS) continue

      const completedPatterns = patterns.filter((p) => p.type === 'completion')
      const weeks = this.getWeekSpan(patterns)
      const tasksPerWeek = weeks > 0 ? completedPatterns.length / weeks : 0

      const avgTime = this.calculateAverageCompletionTime(completedPatterns)

      // Calculate trend
      const recentPatterns = patterns.slice(-10)
      const olderPatterns = patterns.slice(-20, -10)
      const recentRate =
        recentPatterns.filter((p) => p.type === 'completion').length / recentPatterns.length
      const olderRate =
        olderPatterns.filter((p) => p.type === 'completion').length /
        Math.max(olderPatterns.length, 1)

      const trend =
        recentRate > olderRate + 0.1
          ? 'increasing'
          : recentRate < olderRate - 0.1
            ? 'decreasing'
            : 'stable'

      velocities.push({
        projectId,
        projectName: projectId, // Would need to look up actual name
        tasksPerWeek,
        averageCompletionTime: avgTime || 0,
        trend
      })
    }

    return velocities
  }

  analyzeTagCorrelations(): PatternInsight[] {
    const insights: PatternInsight[] = []
    const tagPairs = this.findFrequentTagPairs()

    for (const [pair, count] of Array.from(tagPairs)) {
      if (count >= this.MIN_DATA_POINTS) {
        const [tag1, tag2] = pair.split('|')
        insights.push({
          pattern: `Tasks often have both "${tag1}" and "${tag2}" tags`,
          confidence: 0.7,
          dataPoints: count,
          recommendation: `Consider combining into a single context`
        })
      }
    }

    return insights
  }

  getSmartNextActions(
    availableTasks: TaskWithTags[],
    context: {
      timeOfDay: TimeOfDay
      energyLevel: EnergyLevel
      location?: string
    }
  ): TaskWithTags[] {
    // Score tasks based on historical success patterns
    const scoredTasks = availableTasks.map((task) => {
      let score = 0

      // Check time match
      const timePatterns = this.patterns.filter(
        (p) =>
          p.timeOfDay === context.timeOfDay &&
          p.type === 'completion' &&
          this.taskMatchesPattern(task, p)
      )

      if (timePatterns.length > 0) {
        score += timePatterns.length * 2
      }

      // Check energy match
      if (task.energy_required === context.energyLevel) {
        score += 5
      }

      // Check location match
      if (task.location === context.location) {
        score += 10
      }

      // Boost for frequently completed tags
      const tagCompletions = this.patterns.filter(
        (p) => p.type === 'completion' && p.tags.some((tag) => task.tags?.includes(tag))
      )
      score += tagCompletions.length

      return { task, score }
    })

    // Sort by score and return top tasks
    return scoredTasks.sort((a, b) => b.score - a.score).map((item) => item.task)
  }

  private groupByTimeOfDay(): Record<TimeOfDay, TaskPattern[]> {
    const groups: Record<TimeOfDay, TaskPattern[]> = {
      morning: [],
      afternoon: [],
      evening: [],
      night: []
    }

    for (const pattern of this.patterns) {
      groups[pattern.timeOfDay].push(pattern)
    }

    return groups
  }

  private groupByEnergy(): Record<EnergyLevel, TaskPattern[]> {
    const groups: Record<EnergyLevel, TaskPattern[]> = {
      low: [],
      medium: [],
      high: []
    }

    for (const pattern of this.patterns) {
      if (pattern.energyLevel) {
        groups[pattern.energyLevel].push(pattern)
      }
    }

    return groups
  }

  private groupByProject(): Record<string, TaskPattern[]> {
    const groups: Record<string, TaskPattern[]> = {}

    for (const pattern of this.patterns) {
      if (pattern.projectId) {
        if (!groups[pattern.projectId]) {
          groups[pattern.projectId] = []
        }
        groups[pattern.projectId].push(pattern)
      }
    }

    return groups
  }

  private calculateAverageCompletionTime(patterns: TaskPattern[]): number | null {
    const times = patterns
      .filter((p) => p.completionTime !== undefined)
      .map((p) => p.completionTime!)

    if (times.length === 0) return null

    return times.reduce((sum, time) => sum + time, 0) / times.length
  }

  private getWeekSpan(patterns: TaskPattern[]): number {
    // Simplified: assume patterns span current week
    // In real implementation, would calculate from actual dates
    return 1
  }

  private findFrequentTagPairs(): Map<string, number> {
    const pairs = new Map<string, number>()

    for (const pattern of this.patterns) {
      if (pattern.tags.length >= 2) {
        for (let i = 0; i < pattern.tags.length - 1; i++) {
          for (let j = i + 1; j < pattern.tags.length; j++) {
            const pair = [pattern.tags[i], pattern.tags[j]].sort().join('|')
            pairs.set(pair, (pairs.get(pair) || 0) + 1)
          }
        }
      }
    }

    return pairs
  }

  private taskMatchesPattern(task: TaskWithTags, pattern: TaskPattern): boolean {
    if (pattern.projectId && task.project_id !== pattern.projectId) return false

    if (pattern.tags.length > 0 && task.tags) {
      const hasCommonTag = pattern.tags.some((tag) => task.tags!.includes(tag))
      if (!hasCommonTag) return false
    }

    return true
  }
}
