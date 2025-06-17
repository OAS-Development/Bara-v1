interface ClaudeMessage {
  role: 'user' | 'assistant'
  content: string
}

interface ClaudeResponse {
  content: string
  usage?: {
    input_tokens: number
    output_tokens: number
  }
}

export class ClaudeClient {
  private apiKey: string | null
  private baseUrl = 'https://api.anthropic.com/v1'
  private model = 'claude-3-sonnet-20240229'

  constructor() {
    this.apiKey = process.env.NEXT_PUBLIC_ANTHROPIC_API_KEY || null
  }

  isConfigured(): boolean {
    return this.apiKey !== null
  }

  async sendMessage(
    messages: ClaudeMessage[],
    systemPrompt?: string,
    maxTokens: number = 1000
  ): Promise<ClaudeResponse> {
    if (!this.apiKey) {
      // Return mock response in development
      return this.getMockResponse(messages[messages.length - 1].content)
    }

    try {
      const response = await fetch(`${this.baseUrl}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': this.apiKey,
          'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify({
          model: this.model,
          max_tokens: maxTokens,
          messages,
          system: systemPrompt
        })
      })

      if (!response.ok) {
        throw new Error(`Claude API error: ${response.statusText}`)
      }

      const data = await response.json()
      
      return {
        content: data.content[0].text,
        usage: data.usage
      }
    } catch (error) {
      console.error('Claude API error:', error)
      // Fallback to mock response
      return this.getMockResponse(messages[messages.length - 1].content)
    }
  }

  // Mock responses for development/testing
  private getMockResponse(input: string): ClaudeResponse {
    const lowerInput = input.toLowerCase()

    // Mock task parsing
    if (lowerInput.includes('tomorrow') || lowerInput.includes('next week')) {
      return {
        content: JSON.stringify({
          title: input,
          deferDate: this.getMockDate(lowerInput),
          project: this.detectProject(lowerInput),
          tags: this.detectTags(lowerInput),
          energyRequired: this.detectEnergy(lowerInput),
          timeOfDay: this.detectTimeOfDay(lowerInput)
        })
      }
    }

    // Mock general parsing
    return {
      content: JSON.stringify({
        title: input,
        tags: this.detectTags(lowerInput),
        priority: lowerInput.includes('urgent') || lowerInput.includes('important') ? 'high' : 'normal'
      })
    }
  }

  private getMockDate(input: string): string {
    const now = new Date()
    if (input.includes('tomorrow')) {
      now.setDate(now.getDate() + 1)
    } else if (input.includes('next week')) {
      now.setDate(now.getDate() + 7)
    } else if (input.includes('next month')) {
      now.setMonth(now.getMonth() + 1)
    }
    return now.toISOString()
  }

  private detectProject(input: string): string | null {
    if (input.includes('work')) return 'Work'
    if (input.includes('home')) return 'Personal'
    if (input.includes('shopping') || input.includes('buy')) return 'Shopping'
    return null
  }

  private detectTags(input: string): string[] {
    const tags: string[] = []
    if (input.includes('email')) tags.push('email')
    if (input.includes('call') || input.includes('phone')) tags.push('calls')
    if (input.includes('meeting')) tags.push('meetings')
    if (input.includes('urgent')) tags.push('urgent')
    if (input.includes('errand')) tags.push('errands')
    return tags
  }

  private detectEnergy(input: string): 'low' | 'medium' | 'high' | null {
    if (input.includes('quick') || input.includes('simple')) return 'low'
    if (input.includes('complex') || input.includes('difficult')) return 'high'
    return null
  }

  private detectTimeOfDay(input: string): string | null {
    if (input.includes('morning')) return 'morning'
    if (input.includes('afternoon')) return 'afternoon'
    if (input.includes('evening')) return 'evening'
    if (input.includes('night')) return 'night'
    return null
  }
}