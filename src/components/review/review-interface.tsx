'use client'

import { useState, useEffect } from 'react'
import { useProjectStore } from '@/stores/project-store'
import { createClient } from '@/lib/supabase/client'
import { Database } from '@/types/database.types'
import { CheckCircle, ChevronRight, Calendar, Folder } from 'lucide-react'
import { cn } from '@/lib/utils'

type Project = Database['public']['Tables']['projects']['Row']

interface ProjectWithReview extends Project {
  needsReview: boolean
  daysSinceReview: number | null
}

export function ReviewInterface() {
  const [projectsToReview, setProjectsToReview] = useState<ProjectWithReview[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [loading, setLoading] = useState(true)
  const { projects, updateProject, fetchProjects } = useProjectStore()
  const supabase = createClient()

  useEffect(() => {
    fetchProjects().then(() => {
      calculateReviews()
    })
  }, [])

  const calculateReviews = () => {
    const now = new Date()
    const projectsWithReview = projects
      .filter(p => p.status === 'active' && p.review_interval_days)
      .map(project => {
        const lastReviewed = project.last_reviewed_at ? new Date(project.last_reviewed_at) : new Date(project.created_at)
        const daysSince = Math.floor((now.getTime() - lastReviewed.getTime()) / (1000 * 60 * 60 * 24))
        const needsReview = daysSince >= (project.review_interval_days || 0)
        
        return {
          ...project,
          needsReview,
          daysSinceReview: daysSince
        }
      })
      .filter(p => p.needsReview)
      .sort((a, b) => (b.daysSinceReview || 0) - (a.daysSinceReview || 0))

    setProjectsToReview(projectsWithReview)
    setLoading(false)
  }

  const handleReviewComplete = async () => {
    const project = projectsToReview[currentIndex]
    if (!project) return

    await updateProject(project.id, {
      last_reviewed_at: new Date().toISOString()
    })

    if (currentIndex < projectsToReview.length - 1) {
      setCurrentIndex(currentIndex + 1)
    } else {
      // All reviews complete
      setProjectsToReview([])
    }
  }

  const handleSkip = () => {
    if (currentIndex < projectsToReview.length - 1) {
      setCurrentIndex(currentIndex + 1)
    } else {
      setProjectsToReview([])
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-gray-500">Loading projects for review...</p>
      </div>
    )
  }

  if (projectsToReview.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <CheckCircle className="h-12 w-12 text-green-500 mb-4" />
        <h2 className="text-xl font-semibold mb-2">All Caught Up!</h2>
        <p className="text-gray-500">No projects need review right now.</p>
      </div>
    )
  }

  const currentProject = projectsToReview[currentIndex]
  const progress = ((currentIndex + 1) / projectsToReview.length) * 100

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-xl font-semibold">Project Review</h2>
          <span className="text-sm text-gray-500">
            {currentIndex + 1} of {projectsToReview.length}
          </span>
        </div>
        <div className="w-full bg-gray-800 rounded-full h-2">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="bg-gray-900 rounded-lg p-6">
        <div className="flex items-start gap-4 mb-6">
          <Folder className="h-8 w-8 text-blue-500 flex-shrink-0 mt-1" />
          <div className="flex-1">
            <h3 className="text-2xl font-semibold mb-2">{currentProject.name}</h3>
            {currentProject.note && (
              <p className="text-gray-400 mb-4">{currentProject.note}</p>
            )}
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <span>Type: {currentProject.type}</span>
              <span>•</span>
              <span>{currentProject.daysSinceReview} days since last review</span>
            </div>
          </div>
        </div>

        <div className="space-y-4 mb-6">
          <div className="bg-gray-800 rounded p-4">
            <h4 className="font-medium mb-2">Review Questions</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>• Is this project still relevant to your goals?</li>
              <li>• Are there any tasks that need to be added?</li>
              <li>• Should any tasks be removed or updated?</li>
              <li>• Is the project type (sequential/parallel) still appropriate?</li>
              <li>• Should this project be completed, dropped, or put on hold?</li>
            </ul>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={handleReviewComplete}
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Mark as Reviewed
          </button>
          <button
            onClick={handleSkip}
            className="px-4 py-2 text-gray-400 hover:text-gray-200 transition-colors"
          >
            Skip for Now
          </button>
        </div>
      </div>
    </div>
  )
}