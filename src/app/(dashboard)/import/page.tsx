'use client'

import { useState } from 'react'
import { FileUpload } from '@/components/import/file-upload'
import { ImportPreview } from '@/components/import/import-preview'
import { Download, Info } from 'lucide-react'

type ImportStep = 'upload' | 'preview' | 'importing' | 'complete'

export default function ImportPage() {
  const [step, setStep] = useState<ImportStep>('upload')
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  const handleFileSelect = (file: File) => {
    setSelectedFile(file)
    setStep('preview')
  }

  const handleProceedWithImport = async (parsedData: any) => {
    setStep('importing')
    // Note: Actual import logic will be implemented in Session 5
    // For now, we just show a placeholder
    setTimeout(() => {
      setStep('complete')
    }, 2000)
  }

  const handleCancel = () => {
    setSelectedFile(null)
    setStep('upload')
  }

  const handleReset = () => {
    setSelectedFile(null)
    setStep('upload')
  }

  return (
    <div className="flex h-full">
      <div className="flex-1 flex flex-col">
        <div className="border-b px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold">Import from OmniFocus</h1>
              <p className="text-sm text-gray-500">
                Bring your projects and tasks from OmniFocus into Bara
              </p>
            </div>
            <Download className="h-6 w-6 text-gray-400" />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <div className="max-w-3xl mx-auto">
            {step === 'upload' && (
              <div className="space-y-6">
                <FileUpload onFileSelect={handleFileSelect} />
                
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                  <div className="flex gap-3">
                    <Info className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div className="text-sm text-blue-800">
                      <h4 className="font-semibold mb-2">How to export from OmniFocus</h4>
                      <ol className="list-decimal list-inside space-y-1">
                        <li>Open OmniFocus on your Mac</li>
                        <li>Select File → Export</li>
                        <li>Choose &quot;OmniFocus Document&quot; as the format</li>
                        <li>Save the .ofocus-archive file</li>
                        <li>Upload that file here</li>
                      </ol>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {step === 'preview' && selectedFile && (
              <ImportPreview
                file={selectedFile}
                onProceed={handleProceedWithImport}
                onCancel={handleCancel}
              />
            )}

            {step === 'importing' && (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-6"></div>
                <h2 className="text-xl font-semibold mb-2">Importing Your Data</h2>
                <p className="text-gray-600">
                  This may take a few moments depending on the size of your archive...
                </p>
              </div>
            )}

            {step === 'complete' && (
              <div className="text-center py-12">
                <div className="h-16 w-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h2 className="text-xl font-semibold mb-2">Import Complete!</h2>
                <p className="text-gray-600 mb-6">
                  Your OmniFocus data has been successfully imported.
                </p>
                <div className="space-x-4">
                  <button
                    onClick={() => window.location.href = '/inbox'}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Go to Inbox
                  </button>
                  <button
                    onClick={handleReset}
                    className="px-4 py-2 text-gray-700 hover:text-gray-900"
                  >
                    Import Another File
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}