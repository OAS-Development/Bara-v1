'use client'

import { useState } from 'react'
import { FileUpload } from '@/components/import/file-upload'
import { ImportPreview } from '@/components/import/import-preview'
import { Download, Info } from 'lucide-react'

type ImportStep = 'upload' | 'preview'

export default function ImportPage() {
  const [step, setStep] = useState<ImportStep>('upload')
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  const handleFileSelect = (file: File) => {
    setSelectedFile(file)
    setStep('preview')
  }

  const handleProceedWithImport = async (parsedData: any) => {
    // The ImportPreview component now handles the entire import process
    // This function is no longer needed but kept for compatibility
  }

  const handleCancel = () => {
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
          </div>
        </div>
      </div>
    </div>
  )
}
