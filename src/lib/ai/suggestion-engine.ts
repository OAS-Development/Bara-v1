import { Task } from '@/types'
import { PatternAnalyzer, PatternInsight } from './pattern-analyzer'
import { ContextEngine, CombinedContext } from '@/lib/context/context-engine'
import { TimeRules } from '@/lib/context/time-rules'

export interface TaskSuggestion {
  task: Task
  reason: string
  score: number
  actionType: 'do-now' | 'do-next' | 'delegate' | 'defer' | 'drop'
}

export interface WorkloadBalance {
  todayLoad: number
  weekLoad: number
  recommendation: string
  suggestedDeferrals?: Task[]
}

export interface SmartPriority {
  taskId: string
  suggestedPriority: 'urgent' | 'high' | 'normal' | 'low'
  currentPriority?: string
  reasons: string[]
}

export class SuggestionEngine {
  private patternAnalyzer: PatternAnalyzer
  private contextEngine: ContextEngine
  private timeRules: TimeRules

  constructor() {
    this.patternAnalyzer = new PatternAnalyzer()
    this.contextEngine = new ContextEngine()
    this.timeRules = new TimeRules()
  }

  async getNextActionSuggestions(
    tasks: Task[],
    limit: number = 5
  ): Promise<TaskSuggestion[]> {
    const context = await this.contextEngine.getCurrentContext()
    const suggestions: TaskSuggestion[] = []

    // Get smart next actions from pattern analyzer
    const smartActions = this.patternAnalyzer.getSmartNextActions(tasks, {
      timeOfDay: context.timeOfDay,
      energyLevel: context.energyLevel,
      location: context.nearbyLocationId || undefined
    })

    // Score and categorize each task
    for (const task of smartActions.slice(0, limit * 2)) {
      const suggestion = await this.evaluateTask(task, context)
      suggestions.push(suggestion)
    }

    // Sort by score and return top suggestions
    return suggestions
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
  }

  async evaluateTask(task: Task, context: CombinedContext): Promise<TaskSuggestion> {
    let score = 50 // Base score
    let reason = ''
    let actionType: TaskSuggestion['actionType'] = 'do-next'

    // Context scoring
    const contextScore = this.contextEngine.scoreTaskForContext(task, context)
    score = contextScore.score
    reason = contextScore.reasons[0] || 'Good match for current context'

    // Urgency scoring
    if (task.due_date) {
      const hoursUntilDue = (new Date(task.due_date).getTime() - Date.now()) / (1000 * 60 * 60)
      
      if (hoursUntilDue < 0) {
        score += 30
        reason = 'Overdue task!'
        actionType = 'do-now'
      } else if (hoursUntilDue < 24) {
        score += 25
        reason = 'Due today'
        actionType = 'do-now'
      } else if (hoursUntilDue < 72) {
        score += 15
        reason = 'Due soon'
        actionType = 'do-next'
      }
    }

    // Flagged tasks
    if (task.flagged) {
      score += 10
      if (reason) reason = 'Flagged - ' + reason
    }

    // Energy mismatch handling
    if (task.energy_required) {
      const energyMatch = this.getEnergyMatch(task.energy_required, context.energyLevel)
      if (energyMatch < 0.5) {
        actionType = 'defer'
        reason = 'Wait for better energy level'
        score -= 20
      }
    }

    // Location mismatch
    if (task.location && task.location !== context.nearbyLocationId) {
      actionType = 'defer'
      reason = 'Different location required'
      score -= 30
    }

    return {
      task,
      reason,
      score,
      actionType
    }
  }

  analyzePriorities(tasks: Task[]): SmartPriority[] {
    const priorities: SmartPriority[] = []

    for (const task of tasks) {
      const reasons: string[] = []
      let suggestedPriority: SmartPriority['suggestedPriority'] = 'normal'

      // Check due dates
      if (task.due_date) {
        const daysUntilDue = (new Date(task.due_date).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
        
        if (daysUntilDue < 0) {
          suggestedPriority = 'urgent'
          reasons.push('Overdue')
        } else if (daysUntilDue < 1) {
          suggestedPriority = 'urgent'
          reasons.push('Due today')
        } else if (daysUntilDue < 3) {
          suggestedPriority = 'high'
          reasons.push('Due in ' + Math.round(daysUntilDue) + ' days')
        }
      }

      // Check if flagged
      if (task.flagged && suggestedPriority === 'normal') {
        suggestedPriority = 'high'
        reasons.push('Flagged task')
      }

      // Check blocking status (would need subtask info)
      if (task.project_id) {
        // In real implementation, check if other tasks depend on this
        // For now, just add a placeholder
        if (task.title.toLowerCase().includes('setup') || 
            task.title.toLowerCase().includes('prepare')) {
          if (suggestedPriority === 'normal') {
            suggestedPriority = 'high'
            reasons.push('Likely blocking other tasks')
          }
        }
      }

      priorities.push({
        taskId: task.id,
        suggestedPriority,
        currentPriority: task.status, // Would need actual priority field
        reasons
      })
    }

    return priorities
  }

  analyzeWorkload(tasks: Task[]): WorkloadBalance {
    const today = new Date()
    const weekFromNow = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000)

    // Count tasks due today
    const todayTasks = tasks.filter(task => {
      if (!task.due_date) return false
      const dueDate = new Date(task.due_date)
      return dueDate.toDateString() === today.toDateString()
    })

    // Count tasks due this week
    const weekTasks = tasks.filter(task => {
      if (!task.due_date) return false
      const dueDate = new Date(task.due_date)
      return dueDate <= weekFromNow
    })

    // Calculate load scores
    const todayLoad = todayTasks.reduce((sum, task) => {
      const energy = task.energy_required
      const energyScore = energy === 'high' ? 3 : energy === 'medium' ? 2 : 1
      return sum + energyScore
    }, 0)

    const weekLoad = weekTasks.reduce((sum, task) => {
      const energy = task.energy_required
      const energyScore = energy === 'high' ? 3 : energy === 'medium' ? 2 : 1
      return sum + energyScore
    }, 0)

    // Generate recommendations
    let recommendation = ''
    let suggestedDeferrals: Task[] = []

    if (todayLoad > 15) {
      recommendation = 'Heavy day ahead. Consider deferring some tasks.'
      suggestedDeferrals = todayTasks
        .filter(task => !task.flagged && task.energy_required !== 'low')
        .slice(0, 3)
    } else if (todayLoad < 5) {
      recommendation = 'Light day. Good time to tackle deferred tasks.'
    } else {
      recommendation = 'Balanced workload for today.'
    }

    return {
      todayLoad,
      weekLoad,
      recommendation,
      suggestedDeferrals: suggestedDeferrals.length > 0 ? suggestedDeferrals : undefined
    }
  }

  learnFromFeedback(
    task: Task,
    action: 'completed' | 'deferred' | 'dropped',
    context: CombinedContext
  ): void {
    // Record pattern for future learning
    if (action === 'completed') {
      this.patternAnalyzer.recordTaskCompletion(task, {
        timeOfDay: context.timeOfDay,
        energyLevel: context.energyLevel,
        location: context.nearbyLocationId || undefined
      })
    }

    // In a real implementation, this would also:
    // - Update confidence scores
    // - Adjust recommendation weights
    // - Store feedback for model improvement
  }

  private getEnergyMatch(required: string, current: string): number {
    const levels = { low: 1, medium: 2, high: 3 }
    const requiredLevel = levels[required as keyof typeof levels] || 2
    const currentLevel = levels[current as keyof typeof levels] || 2
    
    if (currentLevel >= requiredLevel) return 1
    if (currentLevel === requiredLevel - 1) return 0.6
    return 0.2
  }

  getInsights(): PatternInsight[] {
    const insights: PatternInsight[] = []

    // Get insights from pattern analyzer
    insights.push(...this.patternAnalyzer.analyzeTimePatterns())
    insights.push(...this.patternAnalyzer.analyzeEnergyPatterns())
    insights.push(...this.patternAnalyzer.analyzeTagCorrelations())

    // Add suggestion engine specific insights
    const velocities = this.patternAnalyzer.analyzeProjectVelocity()
    for (const velocity of velocities) {
      if (velocity.trend === 'decreasing') {
        insights.push({
          pattern: `${velocity.projectName} progress slowing down`,
          confidence: 0.7,
          dataPoints: 10,
          recommendation: 'Review project scope or add resources'
        })
      }
    }

    return insights
  }
}