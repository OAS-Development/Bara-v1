'use client'

import { TodayView } from '@/components/views/today-view'
import { AsyncErrorBoundary } from '@/components/error-boundary'

export default function TodayPage() {
  return (
    <AsyncErrorBoundary>
      <TodayView />
    </AsyncErrorBoundary>
  )
}
