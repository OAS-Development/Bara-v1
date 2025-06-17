'use client'

import { useEffect, useState } from 'react'
import { useProjectStore } from '@/stores/project-store'
import { Calendar, TrendingUp, AlertCircle } from 'lucide-react'

interface ReviewStats {
  totalProjects: number
  reviewableProjects: number
  projectsNeedingReview: number
  overdueReviews: number
  averageReviewInterval: number
}

export function ReviewStats() {
  const { projects } = useProjectStore()
  const [stats, setStats] = useState<ReviewStats>({
    totalProjects: 0,
    reviewableProjects: 0,
    projectsNeedingReview: 0,
    overdueReviews: 0,
    averageReviewInterval: 0
  })

  useEffect(() => {
    calculateStats()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projects])

  const calculateStats = () => {
    const now = new Date()
    const activeProjects = projects.filter((p) => p.status === 'active')
    const reviewableProjects = activeProjects.filter((p) => p.review_interval_days)

    let projectsNeedingReview = 0
    let overdueReviews = 0
    let totalInterval = 0

    reviewableProjects.forEach((project) => {
      const lastReviewed = project.last_reviewed_at
        ? new Date(project.last_reviewed_at)
        : new Date(project.created_at)
      const daysSince = Math.floor((now.getTime() - lastReviewed.getTime()) / (1000 * 60 * 60 * 24))
      const interval = project.review_interval_days || 0

      if (daysSince >= interval) {
        projectsNeedingReview++
        if (daysSince > interval * 1.5) {
          overdueReviews++
        }
      }

      totalInterval += interval
    })

    setStats({
      totalProjects: activeProjects.length,
      reviewableProjects: reviewableProjects.length,
      projectsNeedingReview,
      overdueReviews,
      averageReviewInterval:
        reviewableProjects.length > 0 ? Math.round(totalInterval / reviewableProjects.length) : 0
    })
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <div className="bg-gray-900 rounded-lg p-4">
        <div className="flex items-center gap-3 mb-2">
          <Calendar className="h-5 w-5 text-blue-500" />
          <h3 className="font-medium">Active Projects</h3>
        </div>
        <p className="text-2xl font-semibold">{stats.totalProjects}</p>
        <p className="text-sm text-gray-500">{stats.reviewableProjects} with reviews</p>
      </div>

      <div className="bg-gray-900 rounded-lg p-4">
        <div className="flex items-center gap-3 mb-2">
          <TrendingUp className="h-5 w-5 text-green-500" />
          <h3 className="font-medium">Need Review</h3>
        </div>
        <p className="text-2xl font-semibold">{stats.projectsNeedingReview}</p>
        <p className="text-sm text-gray-500">Ready for review</p>
      </div>

      <div className="bg-gray-900 rounded-lg p-4">
        <div className="flex items-center gap-3 mb-2">
          <AlertCircle className="h-5 w-5 text-yellow-500" />
          <h3 className="font-medium">Overdue</h3>
        </div>
        <p className="text-2xl font-semibold">{stats.overdueReviews}</p>
        <p className="text-sm text-gray-500">Need attention</p>
      </div>

      <div className="bg-gray-900 rounded-lg p-4">
        <div className="flex items-center gap-3 mb-2">
          <Calendar className="h-5 w-5 text-purple-500" />
          <h3 className="font-medium">Avg Interval</h3>
        </div>
        <p className="text-2xl font-semibold">{stats.averageReviewInterval}</p>
        <p className="text-sm text-gray-500">Days between reviews</p>
      </div>
    </div>
  )
}
