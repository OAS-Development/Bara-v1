import { ClaudeClient } from './claude-client'
import { TimeOfDay } from '@/lib/context/time-rules'
import { EnergyLevel } from '@/stores/energy-store'

export interface ParsedTask {
  title: string
  notes?: string
  project?: string
  tags?: string[]
  deferDate?: Date
  dueDate?: Date
  location?: string
  timeOfDay?: TimeOfDay
  energyRequired?: EnergyLevel
  flagged?: boolean
  confidence: number
  ambiguities?: string[]
}

const SYSTEM_PROMPT = `You are a task parsing assistant. Parse natural language task descriptions into structured data.

Extract the following information:
- title: The main task description
- notes: Any additional details
- project: Project name if mentioned
- tags: Relevant tags/contexts
- deferDate: When to start (tomorrow, next week, etc.)
- dueDate: When it's due
- location: Where to do it (home, office, etc.)
- timeOfDay: Best time (morning, afternoon, evening, night)
- energyRequired: Energy level needed (low, medium, high)
- flagged: If marked as important/urgent

Return a JSON object with these fields. Include a confidence score (0-1) and any ambiguities array.`

export class TaskParser {
  private claude: ClaudeClient

  constructor() {
    this.claude = new ClaudeClient()
  }

  async parseNaturalLanguage(input: string): Promise<ParsedTask> {
    if (!this.claude.isConfigured()) {
      // Use rule-based parsing as fallback
      return this.ruleBasedParse(input)
    }

    try {
      const response = await this.claude.sendMessage(
        [{ role: 'user', content: input }],
        SYSTEM_PROMPT,
        500
      )

      const parsed = JSON.parse(response.content)
      return this.validateAndNormalizeParsedTask(parsed)
    } catch (error) {
      console.error('AI parsing failed, falling back to rules:', error)
      return this.ruleBasedParse(input)
    }
  }

  private ruleBasedParse(input: string): ParsedTask {
    const lower = input.toLowerCase()
    const result: ParsedTask = {
      title: input,
      confidence: 0.7,
      ambiguities: []
    }

    // Extract dates
    const datePatterns = {
      today: () => new Date(),
      tomorrow: () => {
        const d = new Date()
        d.setDate(d.getDate() + 1)
        return d
      },
      'next week': () => {
        const d = new Date()
        d.setDate(d.getDate() + 7)
        return d
      },
      'next month': () => {
        const d = new Date()
        d.setMonth(d.getMonth() + 1)
        return d
      }
    }

    for (const [pattern, getDate] of Object.entries(datePatterns)) {
      if (lower.includes(pattern)) {
        if (lower.includes('due') || lower.includes('by')) {
          result.dueDate = getDate()
        } else if (lower.includes('start') || lower.includes('defer')) {
          result.deferDate = getDate()
        } else {
          result.deferDate = getDate()
          result.ambiguities?.push(`Assumed "${pattern}" means defer date`)
        }
      }
    }

    // Extract project
    const projectMatches = input.match(/(?:for|in|project:)\s+([A-Za-z]+)/i)
    if (projectMatches) {
      result.project = projectMatches[1]
    }

    // Extract tags
    const tags: string[] = []
    const tagPatterns = {
      email: /\bemail\b/i,
      call: /\b(call|phone)\b/i,
      meeting: /\bmeet(ing)?\b/i,
      errand: /\berrand\b/i,
      urgent: /\b(urgent|asap|important)\b/i,
      work: /\bwork\b/i,
      home: /\bhome\b/i
    }

    for (const [tag, pattern] of Object.entries(tagPatterns)) {
      if (pattern.test(input)) {
        tags.push(tag)
      }
    }

    if (tags.length > 0) {
      result.tags = tags
    }

    // Extract location
    const locationPatterns = {
      home: /\b(home|house)\b/i,
      office: /\b(office|work)\b/i,
      gym: /\bgym\b/i,
      store: /\b(store|shop|market)\b/i
    }

    for (const [location, pattern] of Object.entries(locationPatterns)) {
      if (pattern.test(input)) {
        result.location = location
        break
      }
    }

    // Extract time of day
    const timePatterns: Record<TimeOfDay, RegExp> = {
      morning: /\bmorning\b/i,
      afternoon: /\bafternoon\b/i,
      evening: /\bevening\b/i,
      night: /\bnight\b/i
    }

    for (const [time, pattern] of Object.entries(timePatterns)) {
      if (pattern.test(input)) {
        result.timeOfDay = time as TimeOfDay
        break
      }
    }

    // Extract energy level
    if (/\b(quick|simple|easy)\b/i.test(input)) {
      result.energyRequired = 'low'
    } else if (/\b(complex|difficult|hard)\b/i.test(input)) {
      result.energyRequired = 'high'
    }

    // Check if flagged
    if (/\b(urgent|important|asap|critical)\b/i.test(input)) {
      result.flagged = true
    }

    // Clean up title by removing parsed elements
    let cleanTitle = input
    const removePatterns = [
      /\b(tomorrow|today|next week|next month)\b/gi,
      /\b(due|by|start|defer)\s+(tomorrow|today|next week|next month)\b/gi,
      /\b(for|in|project:)\s+\w+/gi,
      /\bat\s+(home|office|gym)\b/gi,
      /\bin\s+the\s+(morning|afternoon|evening|night)\b/gi
    ]

    for (const pattern of removePatterns) {
      cleanTitle = cleanTitle.replace(pattern, '').trim()
    }

    result.title = cleanTitle || input

    return result
  }

  private validateAndNormalizeParsedTask(parsed: any): ParsedTask {
    const result: ParsedTask = {
      title: parsed.title || 'New Task',
      confidence: parsed.confidence || 0.8
    }

    // Validate and normalize dates
    if (parsed.deferDate) {
      const date = new Date(parsed.deferDate)
      if (!isNaN(date.getTime())) {
        result.deferDate = date
      }
    }

    if (parsed.dueDate) {
      const date = new Date(parsed.dueDate)
      if (!isNaN(date.getTime())) {
        result.dueDate = date
      }
    }

    // Validate enums
    const validTimeOfDay = ['morning', 'afternoon', 'evening', 'night']
    if (parsed.timeOfDay && validTimeOfDay.includes(parsed.timeOfDay)) {
      result.timeOfDay = parsed.timeOfDay
    }

    const validEnergy = ['low', 'medium', 'high']
    if (parsed.energyRequired && validEnergy.includes(parsed.energyRequired)) {
      result.energyRequired = parsed.energyRequired
    }

    // Copy other fields
    if (parsed.notes) result.notes = parsed.notes
    if (parsed.project) result.project = parsed.project
    if (parsed.tags && Array.isArray(parsed.tags)) result.tags = parsed.tags
    if (parsed.location) result.location = parsed.location
    if (parsed.flagged) result.flagged = parsed.flagged
    if (parsed.ambiguities && Array.isArray(parsed.ambiguities)) {
      result.ambiguities = parsed.ambiguities
    }

    return result
  }

  getSampleInputs(): string[] {
    return [
      "Call John about the project tomorrow morning",
      "Buy groceries at the store this evening",
      "Review quarterly report due next week - high energy task",
      "Quick email to client about meeting",
      "Plan vacation next month when I have time",
      "Urgent: Fix bug in production by end of day",
      "Morning gym workout routine",
      "Write blog post draft - needs focus time"
    ]
  }
}