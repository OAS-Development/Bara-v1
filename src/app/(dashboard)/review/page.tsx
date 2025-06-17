'use client'

import { useState } from 'react'
import { ReviewInterface } from '@/components/review/review-interface'
import { ReviewStats } from '@/components/review/review-stats'
import { CheckCircle, Play } from 'lucide-react'

export default function ReviewPage() {
  const [isReviewing, setIsReviewing] = useState(false)

  return (
    <div className="flex h-full">
      <div className="flex-1 flex flex-col">
        <div className="border-b px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold">Review</h1>
              <p className="text-sm text-gray-500">
                Keep your projects up to date and relevant
              </p>
            </div>
            {!isReviewing && (
              <button
                onClick={() => setIsReviewing(true)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Play className="h-4 w-4" />
                Start Review
              </button>
            )}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {isReviewing ? (
            <ReviewInterface />
          ) : (
            <div className="p-6 space-y-6">
              <ReviewStats />
              
              <div className="bg-gray-900 rounded-lg p-6">
                <h2 className="text-lg font-semibold mb-4">About Reviews</h2>
                <div className="space-y-3 text-sm text-gray-400">
                  <p>
                    Regular reviews help you keep your project list current and focused on what matters most.
                  </p>
                  <p>
                    During a review, you&apos;ll go through each project that&apos;s due for review and consider:
                  </p>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>Whether the project is still relevant</li>
                    <li>If any tasks need to be added or removed</li>
                    <li>Whether the project should be completed, dropped, or put on hold</li>
                  </ul>
                  <p>
                    Set review intervals on your projects to be reminded when they need attention.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}