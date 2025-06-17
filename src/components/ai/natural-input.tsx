'use client'

import { useState, useRef, useEffect } from 'react'
import { TaskParser, ParsedTask } from '@/lib/ai/task-parser'
import { Sparkles, Loader2, AlertCircle } from 'lucide-react'

interface NaturalInputProps {
  onParsed: (task: ParsedTask) => void
  placeholder?: string
  className?: string
}

export function NaturalInput({ 
  onParsed, 
  placeholder = "Add a task using natural language...",
  className = ""
}: NaturalInputProps) {
  const [input, setInput] = useState('')
  const [isParsing, setIsParsing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const parser = new TaskParser()

  useEffect(() => {
    // Load sample suggestions
    setSuggestions(parser.getSampleInputs())
  }, [])

  const handleParse = async () => {
    if (!input.trim()) return

    setIsParsing(true)
    setError(null)

    try {
      const parsed = await parser.parseNaturalLanguage(input)
      onParsed(parsed)
      setInput('')
      setShowSuggestions(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to parse task')
    } finally {
      setIsParsing(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleParse()
    }
  }

  const handleSuggestionClick = (suggestion: string) => {
    setInput(suggestion)
    setShowSuggestions(false)
    inputRef.current?.focus()
  }

  return (
    <div className={`relative ${className}`}>
      <div className="relative">
        <textarea
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => setShowSuggestions(true)}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
          placeholder={placeholder}
          rows={2}
          className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          disabled={isParsing}
        />
        
        <button
          onClick={handleParse}
          disabled={!input.trim() || isParsing}
          className="absolute right-2 top-3 p-2 text-blue-600 hover:bg-blue-50 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          title="Parse with AI"
        >
          {isParsing ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <Sparkles className="h-5 w-5" />
          )}
        </button>
      </div>

      {error && (
        <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
          <AlertCircle className="h-4 w-4 text-red-500 mt-0.5" />
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {showSuggestions && suggestions.length > 0 && !input && (
        <div className="absolute z-10 w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden">
          <div className="p-2 bg-gray-50 border-b border-gray-200">
            <p className="text-xs text-gray-600 font-medium">Try these examples:</p>
          </div>
          <div className="max-h-48 overflow-y-auto">
            {suggestions.map((suggestion, index) => (
              <button
                key={index}
                onClick={() => handleSuggestionClick(suggestion)}
                className="w-full px-4 py-2 text-left text-sm hover:bg-blue-50 transition-colors border-b border-gray-100 last:border-0"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="mt-2 flex items-center gap-2 text-xs text-gray-500">
        <Sparkles className="h-3 w-3" />
        <span>Powered by AI • Use natural language to describe your task</span>
      </div>
    </div>
  )
}