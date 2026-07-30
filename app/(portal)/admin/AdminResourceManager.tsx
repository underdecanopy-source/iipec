'use client'

import { useEffect, useState, useRef } from 'react'

type Resource = {
  id: string
  title: string
  description?: string
  fileUrl: string
  fileType?: string
  fileName: string
  size?: string
}

function resourceUrl(resource: Resource) {
  return resource.fileUrl
}

export function AdminResourceManager() {
  const [resources, setResources] = useState<Resource[]>([])
  const [file, setFile] = useState<File | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/resources')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Unable to load resources')
        }
        return response.json()
      })
      .then(setResources)
      .catch(() => setError('Unable to load member resources.'))
  }, [])

  async function handleUpload(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    if (!file) {
      setError('Choose a file before uploading.')
      return
    }

    setLoading(true)

    const fd = new FormData()
    fd.append('file', file)
    fd.append('title', title.trim() || file.name)
    fd.append('description', description.trim())

    const res = await fetch('/api/resources/upload', { method: 'POST', body: fd })

    if (res.ok) {
      const newResource = await res.json()
      setResources((current) => [newResource, ...current])
      setFile(null)
      setTitle('')
      setDescription('')
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    } else {
      const data = await res.json().catch(() => ({}))
      setError(data.error || 'Upload failed. Please try again.')
    }

    setLoading(false)
  }

  async function handleDelete(resourceId: string) {
    // Prevent multiple deletes at once
    if (deletingId) return

    const confirmed = window.confirm('Are you sure you want to delete this resource? This action cannot be undone.')
    if (!confirmed) {
      return
    }

    setDeletingId(resourceId)
    setError('')

    const res = await fetch(`/api/resources/${resourceId}`, { method: 'DELETE' })

    if (res.ok) {
      setResources((current) => current.filter((r) => r.id !== resourceId))
    } else {
      const responseText = await res.text().catch(() => 'An unknown error occurred.');
      try {
        const data = JSON.parse(responseText)
        const errorMessage = data.error || `Delete failed with status: ${res.status}`
        setError(errorMessage)
      } catch (e) {
        setError(responseText || 'Delete failed. The server returned an invalid response.')
        console.error('Failed to parse JSON response from delete API:', responseText)
      }
    }
    setDeletingId(null)
  }

  return (
    <div className="space-y-6">
      <section className="bg-white rounded-xl p-6 shadow-sm">
        <h2 className="text-xl font-bold text-primary mb-3">Feed Member Resources</h2>
        <p className="text-gray-600 mb-5">
          Upload PDFs, audio, video, or other files here. Members will see them in the member resources area.
        </p>

        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleUpload} className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Resource File</label>
              <input
                type="file"
                accept=".pdf,audio/*,video/*,.doc,.docx,.ppt,.pptx,.xls,.xlsx,image/*"
                ref={fileInputRef}
                onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter a title or leave blank to use filename"
                className="w-full rounded-lg border border-gray-300 px-3 py-2"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Optional note for members"
              className="w-full rounded-lg border border-gray-300 px-3 py-2"
            />
          </div>
          <button type="submit" disabled={loading} className="btn-primary px-4 py-2 disabled:opacity-50">
            {loading ? 'Uploading...' : 'Upload to Member Area'}
          </button>
        </form>
      </section>

      <section className="bg-white rounded-xl p-6 shadow-sm">
        <div className="flex flex-col gap-4 mb-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-bold text-primary">Published Resources</h2>
            <p className="text-sm text-gray-600">These files are available to signed-in members.</p>
          </div>
          <a href="/member-resources" className="btn-outline text-sm px-4 py-2 text-center">
            View Member Page
          </a>
        </div>

        <div className="space-y-3">
          {resources.length === 0 ? (
            <p className="text-gray-600">No resources have been uploaded yet.</p>
          ) : (
            resources.map((resource) => (
              <div key={resource.id} className="flex flex-col gap-3 rounded-lg border border-gray-200 p-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0">
                  <h3 className="font-semibold text-primary">{resource.title}</h3>
                  {resource.description && <p className="text-sm text-gray-600">{resource.description}</p>}
                  <p className="text-xs text-gray-400 mt-1">{resource.fileType || 'File'} | {resource.size || 'Size unavailable'}</p>
                </div>
                <div className="flex flex-col gap-2 flex-shrink-0 sm:flex-row sm:items-center">
                  <a href={resourceUrl(resource)} className="btn-accent text-sm px-4 py-2 text-center" target="_blank" rel="noopener noreferrer">
                    Open
                  </a>
                  <button
                    onClick={() => handleDelete(resource.id)}
                    disabled={deletingId === resource.id}
                    className="btn-danger text-sm px-4 py-2 disabled:opacity-50"
                  >
                    {deletingId === resource.id ? 'Deleting...' : 'Delete'}
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  )
}
