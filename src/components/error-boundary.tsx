'use client'

import React from 'react'
import { AlertTriangle, RefreshCw } from 'lucide-react'

interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
}

export class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  ErrorBoundaryState
> {
  constructor(props: { children: React.ReactNode }) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4">
          <div className="bg-red-900/20 border border-red-800 rounded-lg p-8 max-w-md w-full">
            <div className="flex items-center gap-3 mb-4">
              <AlertTriangle className="h-6 w-6 text-red-500" />
              <h2 className="text-xl font-semibold">Something went wrong</h2>
            </div>
            
            <p className="text-gray-400 mb-6">
              An unexpected error occurred. You can try refreshing the page or contact support if the problem persists.
            </p>
            
            {this.state.error && (
              <details className="mb-6">
                <summary className="cursor-pointer text-sm text-gray-500 hover:text-gray-400">
                  Technical details
                </summary>
                <pre className="mt-2 text-xs text-gray-600 overflow-x-auto">
                  {this.state.error.stack}
                </pre>
              </details>
            )}
            
            <div className="flex gap-3">
              <button
                onClick={() => window.location.reload()}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
              >
                <RefreshCw className="h-4 w-4" />
                Refresh page
              </button>
              
              <button
                onClick={() => this.setState({ hasError: false, error: null })}
                className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
              >
                Try again
              </button>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}