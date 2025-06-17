'use client'

import { ForecastView } from '@/components/views/forecast-view'
import { AsyncErrorBoundary } from '@/components/error-boundary'

export default function UpcomingPage() {
  return (
    <AsyncErrorBoundary>
      <ForecastView />
    </AsyncErrorBoundary>
  )
}
