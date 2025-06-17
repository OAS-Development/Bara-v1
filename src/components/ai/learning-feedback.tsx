'use client'

import { useState } from 'react'
import { SuggestionEngine } from '@/lib/ai/suggestion-engine'
import { ContextEngine } from '@/lib/context/context-engine'
import { Task } from '@/types'
import { ThumbsUp, ThumbsDown, MessageSquare, X } from 'lucide-react'
import * as Dialog from '@radix-ui/react-dialog'

interface LearningFeedbackProps {
  task: Task
  action: 'completed' | 'deferred' | 'dropped'
  onClose: () => void
}

export function LearningFeedback({ task, action, onClose }: LearningFeedbackProps) {
  const [feedback, setFeedback] = useState<'helpful' | 'not-helpful' | null>(null)
  const [comment, setComment] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const suggestionEngine = new SuggestionEngine()
  const contextEngine = new ContextEngine()

  const handleSubmit = async () => {
    setIsSubmitting(true)

    try {
      // Get current context
      const context = await contextEngine.getCurrentContext()

      // Record the learning feedback
      suggestionEngine.learnFromFeedback(task, action, context)

      // In a real implementation, would also send to backend
      console.log('Learning feedback:', {
        task: task.id,
        action,
        feedback,
        comment,
        context
      })

      // Close after a short delay
      setTimeout(onClose, 500)
    } catch (error) {
      console.error('Failed to submit feedback:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const getActionMessage = () => {
    switch (action) {
      case 'completed':
        return 'Great job completing this task!'
      case 'deferred':
        return 'Task deferred for later.'
      case 'dropped':
        return 'Task removed from your list.'
    }
  }

  return (
    <Dialog.Root open={true} onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/30" />
        <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg p-6 w-full max-w-md">
          <div className="flex items-center justify-between mb-4">
            <Dialog.Title className="text-lg font-semibold">Help AI Learn</Dialog.Title>
            <button
              onClick={onClose}
              className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="space-y-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm font-medium text-gray-900">{getActionMessage()}</p>
              <p className="text-sm text-gray-600 mt-1">&ldquo;{task.title}&rdquo;</p>
            </div>

            <div>
              <p className="text-sm font-medium text-gray-700 mb-3">
                Was the AI suggestion helpful for this task?
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setFeedback('helpful')}
                  className={`flex-1 p-3 rounded-lg border-2 transition-colors ${
                    feedback === 'helpful'
                      ? 'border-green-500 bg-green-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <ThumbsUp
                    className={`h-5 w-5 mx-auto ${
                      feedback === 'helpful' ? 'text-green-600' : 'text-gray-400'
                    }`}
                  />
                  <p className="text-sm mt-1">Helpful</p>
                </button>
                <button
                  onClick={() => setFeedback('not-helpful')}
                  className={`flex-1 p-3 rounded-lg border-2 transition-colors ${
                    feedback === 'not-helpful'
                      ? 'border-red-500 bg-red-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <ThumbsDown
                    className={`h-5 w-5 mx-auto ${
                      feedback === 'not-helpful' ? 'text-red-600' : 'text-gray-400'
                    }`}
                  />
                  <p className="text-sm mt-1">Not Helpful</p>
                </button>
              </div>
            </div>

            {feedback && (
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                  <MessageSquare className="h-4 w-4" />
                  Additional feedback (optional)
                </label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="What could be improved?"
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                />
              </div>
            )}

            <div className="flex gap-3 pt-2">
              <button
                onClick={onClose}
                className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Skip
              </button>
              <button
                onClick={handleSubmit}
                disabled={!feedback || isSubmitting}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
              </button>
            </div>

            <p className="text-xs text-gray-500 text-center">
              Your feedback helps improve AI suggestions for everyone
            </p>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
