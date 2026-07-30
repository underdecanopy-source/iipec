'use client'

import { useEffect, useState } from 'react'

type Resource = {
  id: string
  title: string
  description?: string
  fileUrl: string
  fileType?: string
  size?: string
}

function resourceUrl(resource: Resource, download = false) {
  return download ? `/api/resources/${resource.id}/download?download=1` : resource.fileUrl;
}

export default function MemberResourcesPage() {
  const [resources, setResources] = useState<Resource[]>([])
  const [error, setError] = useState('')

  useEffect(() => {
    fetch('/api/resources')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Unable to load resources')
        }
        return response.json()
      })
      .then(setResources)
      .catch(() => setError('Unable to load resources. Please try again later.'))
  }, [])

  return (
    <div>
      <h1 className="text-3xl font-bold text-primary mb-2">Member Resources</h1>
      <p className="text-gray-600 mb-8">
        Access downloadable PDFs, audio, video, and other resources shared by the admin team.
      </p>

      {error && (
        <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4">
          {error}
        </div>
      )}

      <div className="space-y-4">
        {resources.length === 0 ? (
          <div className="bg-white rounded-xl p-6 shadow-sm text-gray-600">
            No member resources have been published yet.
          </div>
        ) : (
          resources.map((resource) => (
            <div key={resource.id} className="bg-white rounded-xl p-6 shadow-sm flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h3 className="font-bold text-primary">{resource.title}</h3>
                {resource.description && <p className="text-gray-600 text-sm">{resource.description}</p>}
                <p className="text-xs text-gray-400 mt-1">{resource.fileType || 'File'} | {resource.size || 'Size unavailable'}</p>
              </div>
              <div className="flex gap-2">
                <a href={resourceUrl(resource)} className="btn-accent text-sm px-4 py-2" target="_blank" rel="noreferrer">
                  Open
                </a>
                <a href={resourceUrl(resource, true)} className="btn-primary text-sm px-4 py-2">
                  Download
                </a>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
