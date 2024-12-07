'use client'

import { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import JSZip from 'jszip'
import { saveAs } from 'file-saver'

// Replace the Heroicons import with an inline SVG component
const GitHubIcon = () => (
  <svg
    viewBox="0 0 24 24"
    width="24"
    height="24"
    fill="currentColor"
    className="h-6 w-6"
  >
    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
  </svg>
)

export default function Home() {
  const [processing, setProcessing] = useState(false)
  const [removeFirstLine, setRemoveFirstLine] = useState(false)
  const [truncateFilenames, setTruncateFilenames] = useState(false)
  const [previousTruncateState, setPreviousTruncateState] = useState(false)

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    setProcessing(true)
    
    try {
      const zip = new JSZip()
      
      for (const file of acceptedFiles) {
        const content = await file.text()
        const pages = content.split('---').filter(page => page.trim())
        
        pages.forEach(page => {
          const lines = page.trim().split('\n')
          const firstLine = lines[0].trim()
          
          // Create filename
          let filename = firstLine
          if (truncateFilenames) {
            filename = filename.substring(0, 25)
          }
          filename = `${filename}.md`
          
          // Create content
          const content = removeFirstLine 
            ? lines.slice(1).join('\n').trim()
            : page.trim()
          
          // Add file to zip
          zip.file(filename, content)
        })
      }
      
      const zipBlob = await zip.generateAsync({ type: 'blob' })
      saveAs(zipBlob, 'extracted-markdown.zip')
    } catch (error) {
      console.error('Error processing files:', error)
      alert('There was an error processing your files')
    } finally {
      setProcessing(false)
    }
  }, [removeFirstLine, truncateFilenames])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ 
    onDrop,
    accept: {
      'text/markdown': ['.md']
    }
  })

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-blue-50 to-white">
      <main className="flex-grow container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-4xl font-bold mb-4 text-blue-900">Mem Extract</h1>
          
          <p className="text-gray-700 mb-4">
            Upload a markdown file exported from <a href="https://mem.ai/settings/exports" className="underline hover:text-blue-800">mem.ai</a> and 
            Mem Extract will:
          </p>
          
          <ul className="list-disc list-inside mb-8 text-gray-700">
            <li>Split it into individual files</li>
            <li>Name each file using the first line</li>
            <li>Download all files in a zip folder</li>
          </ul>
          
          <div className="space-y-4 mb-8 bg-white p-6 rounded-lg shadow-sm border border-blue-100">
            <h2 className="text-lg font-semibold text-blue-900 mb-2">Options</h2>
            
            <label className="flex items-center space-x-2 hover:text-blue-700 cursor-pointer">
              <input
                type="checkbox"
                checked={removeFirstLine}
                onChange={(e) => {
                  if (e.target.checked) {
                    // Store current state before forcing it true
                    setPreviousTruncateState(truncateFilenames)
                    setTruncateFilenames(true)
                  } else {
                    // Restore previous state when unchecking
                    setTruncateFilenames(previousTruncateState)
                  }
                  setRemoveFirstLine(e.target.checked)
                }}
                className="rounded border-blue-300 text-blue-600 focus:ring-blue-500"
              />
              <span>Remove first line from content (use as filename only)</span>
            </label>
            
            <label className={`flex items-center space-x-2 ${
              removeFirstLine 
                ? 'opacity-50 cursor-not-allowed' 
                : 'hover:text-blue-700 cursor-pointer'
            }`}>
              <input
                type="checkbox"
                checked={truncateFilenames}
                onChange={(e) => setTruncateFilenames(e.target.checked)}
                disabled={removeFirstLine}
                className="rounded border-blue-300 text-blue-600 focus:ring-blue-500 
                  disabled:opacity-50 disabled:cursor-not-allowed"
              />
              <span>Truncate filenames to 25 characters</span>
            </label>
          </div>
          
          <div 
            {...getRootProps()} 
            className={`p-12 border-2 border-dashed rounded-lg text-center cursor-pointer
              transition-all duration-200 bg-white shadow-sm
              ${isDragActive 
                ? 'border-blue-500 bg-blue-50 shadow-md scale-[1.02]' 
                : 'border-blue-200 hover:border-blue-400 hover:shadow-md hover:scale-[1.01]'}
              ${processing ? 'opacity-50 pointer-events-none' : ''}`}
          >
            <input {...getInputProps()} />
            {processing ? (
              <p className="text-blue-600">Processing files...</p>
            ) : isDragActive ? (
              <p className="text-blue-600 font-medium">Drop the markdown file here...</p>
            ) : (
              <div className="space-y-2">
                <p className="text-blue-900 font-medium">Drag and drop a markdown file here</p>
                <p className="text-blue-600 text-sm">or click to select one</p>
              </div>
            )}
          </div>
        </div>
      </main>
      
      <footer className="border-t border-blue-100 bg-white">
        <div className="container mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-6">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-500 hover:text-gray-700 transition-colors"
              >
                <GitHubIcon />
              </a>
              <a 
                href="mailto:memextract@soba.solutions"
                className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
              >
                Send Feedback
              </a>
            </div>
            <div className="text-sm text-gray-500">
              <div>Mem Extract {new Date().getFullYear()} v0.1</div>
              <p>
                <a 
                  href="https://creativecommons.org/publicdomain/zero/1.0/?ref=chooser-v1" 
                  target="_blank" 
                  rel="license noopener noreferrer" 
                  className="inline-flex items-center"
                >
                  <img 
                    src="/cc.svg" 
                    alt="Creative Commons"
                    className="h-[22px] mr-1 text-gray-500"
                  />
                  <img 
                    src="/zero.svg" 
                    alt="CC0"
                    className="h-[22px] mr-2 text-gray-500"
                  />
                  CC0 1.0 Universal
                </a>
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
