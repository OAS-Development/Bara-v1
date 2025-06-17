'use client'

import { useState, useEffect } from 'react'
import { OmniFocusParser, OmniFocusData } from '@/lib/import/omnifocus-parser'
import { ImportMapper } from '@/lib/import/import-mapper'
import { ImportExecutor, ImportProgress, ImportResult, ImportOptions } from '@/lib/import/import-executor'
import { ImportMappingConfig } from './import-mapping-config'
import { ImportProgress as ImportProgressDisplay } from './import-progress'
import { ImportReport } from './import-report'
import { FileText, Folder, Tag, CheckCircle, AlertCircle } from 'lucide-react'

interface ImportPreviewProps {
  file: File
  onProceed: (data: any) => void
  onCancel: () => void
}

type ImportPhase = 'parsing' | 'preview' | 'importing' | 'complete'

export function ImportPreview({ file, onProceed, onCancel }: ImportPreviewProps) {
  const [phase, setPhase] = useState<ImportPhase>('parsing')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [parsedData, setParsedData] = useState<OmniFocusData | null>(null)
  const [statistics, setStatistics] = useState<any>(null)
  const [importOptions, setImportOptions] = useState<ImportOptions>({
    duplicateStrategy: 'skip',
    importCompleted: false,
    preserveHierarchy: true
  })
  const [validation, setValidation] = useState<any>(null)
  const [importProgress, setImportProgress] = useState<ImportProgress | null>(null)
  const [importResult, setImportResult] = useState<ImportResult | null>(null)
  const [importReport, setImportReport] = useState<string>('')

  useEffect(() => {
    parseFile()
  }, [])

  const parseFile = async () => {
    setLoading(true)
    setError(null)
    setPhase('parsing')

    try {
      const parser = new OmniFocusParser()
      const data = await parser.parseArchive(file)
      const stats = parser.getStatistics(data)
      
      setParsedData(data)
      setStatistics(stats)
      
      // Validate with default options
      const { data: { user } } = await (await import('@supabase/auth-helpers-nextjs')).createClientComponentClient().auth.getUser()
      const mapper = new ImportMapper({ ...importOptions, userId: user?.id || '' })
      const validationResult = mapper.validateMapping(data)
      setValidation(validationResult)
      
      setPhase('preview')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to parse file')
    } finally {
      setLoading(false)
    }
  }

  const handleOptionsChange = (newOptions: ImportOptions) => {
    setImportOptions(newOptions)
    if (parsedData) {
      // Re-validate with new options
      const validateAsync = async () => {
        const { data: { user } } = await (await import('@supabase/auth-helpers-nextjs')).createClientComponentClient().auth.getUser()
        const mapper = new ImportMapper({ ...newOptions, userId: user?.id || '' })
        const validationResult = mapper.validateMapping(parsedData)
        setValidation(validationResult)
      }
      validateAsync()
    }
  }

  const handleStartImport = async () => {
    if (!parsedData) return

    setPhase('importing')
    setError(null)

    try {
      const executor = new ImportExecutor({
        ...importOptions,
        onProgress: setImportProgress
      })
      const result = await executor.execute(parsedData)
      const report = executor.generateReport(result, parsedData)
      
      setImportResult(result)
      setImportReport(report)
      setPhase('complete')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Import failed')
      setPhase('preview')
    }
  }

  const handleDownloadReport = () => {
    const blob = new Blob([importReport], { type: 'text/markdown' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `omnifocus-import-${new Date().toISOString().split('T')[0]}.md`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const handleViewImported = () => {
    window.location.href = '/inbox'
  }

  if (phase === 'parsing' && loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Parsing OmniFocus archive...</p>
        </div>
      </div>
    )
  }

  if (error && phase !== 'importing') {
    return (
      <div className="p-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-red-900 mb-2">Error</h3>
          <p className="text-red-700">{error}</p>
          <button
            onClick={onCancel}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Go Back
          </button>
        </div>
      </div>
    )
  }

  if (phase === 'importing' && importProgress) {
    return (
      <div className="p-8">
        <h2 className="text-xl font-semibold mb-6">Importing Your Data</h2>
        <ImportProgressDisplay progress={importProgress} />
        {error && (
          <div className="mt-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}
      </div>
    )
  }

  if (phase === 'complete' && importResult) {
    return (
      <div className="p-8">
        <h2 className="text-xl font-semibold mb-6">Import Complete</h2>
        <ImportReport 
          result={importResult}
          report={importReport}
          onDownload={handleDownloadReport}
          onClose={onCancel}
          onViewImported={handleViewImported}
        />
      </div>
    )
  }

  if (!statistics || phase !== 'preview') return null

  return (
    <div className="space-y-6">
      <div className="bg-gray-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">Import Preview</h3>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg p-4 text-center">
            <Folder className="h-8 w-8 text-blue-500 mx-auto mb-2" />
            <p className="text-2xl font-bold">{statistics.totalProjects}</p>
            <p className="text-sm text-gray-600">Projects</p>
            <p className="text-xs text-gray-500">{statistics.activeProjects} active</p>
          </div>
          
          <div className="bg-white rounded-lg p-4 text-center">
            <FileText className="h-8 w-8 text-green-500 mx-auto mb-2" />
            <p className="text-2xl font-bold">{statistics.totalTasks}</p>
            <p className="text-sm text-gray-600">Tasks</p>
            <p className="text-xs text-gray-500">{statistics.completedTasks} completed</p>
          </div>
          
          <div className="bg-white rounded-lg p-4 text-center">
            <Tag className="h-8 w-8 text-purple-500 mx-auto mb-2" />
            <p className="text-2xl font-bold">{statistics.totalContexts}</p>
            <p className="text-sm text-gray-600">Contexts</p>
          </div>
          
          <div className="bg-white rounded-lg p-4 text-center">
            <CheckCircle className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
            <p className="text-2xl font-bold">{statistics.completionRate}%</p>
            <p className="text-sm text-gray-600">Complete</p>
          </div>
        </div>
      </div>

      {validation && (
        <ImportMappingConfig
          unmappedContexts={validation.unmappedContexts}
          duplicateTasks={validation.duplicateTasks}
          warnings={validation.warnings}
          onConfigChange={handleOptionsChange}
        />
      )}

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h4 className="font-medium text-blue-900 mb-3">Ready to Import?</h4>
        <p className="text-sm text-blue-800 mb-4">
          This will create {statistics.totalProjects} projects and {statistics.totalTasks} tasks in your Bara workspace.
          The import process may take a few moments depending on the size of your archive.
        </p>
        <div className="flex gap-3">
          <button
            onClick={handleStartImport}
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Start Import
          </button>
          <button
            onClick={onCancel}
            className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}