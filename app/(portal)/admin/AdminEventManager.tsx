'use client'

import { FormEvent, useEffect, useState } from 'react'

type AdminEvent = {
  id: string
  title: string
  date: string
  time: string
  location: string
  description: string
  image: string | null
  isUpcoming: boolean
}

const emptyForm = {
  title: '',
  date: '',
  time: '',
  location: '',
  description: '',
  isUpcoming: true,
}

export function AdminEventManager() {
  const [events, setEvents] = useState<AdminEvent[]>([])
  const [form, setForm] = useState(emptyForm)
  const [image, setImage] = useState<File | null>(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [actionId, setActionId] = useState<string | null>(null)

  async function loadEvents() {
    setLoading(true)
    const response = await fetch('/api/admin/events')
    if (!response.ok) {
      setError('Unable to load events.')
      setLoading(false)
      return
    }
    setEvents(await response.json())
    setLoading(false)
  }

  useEffect(() => {
    void loadEvents()
  }, [])

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    setError('')
    setSaving(true)

    try {
      let imageUrl: string | undefined
      if (image) {
        const uploadData = new FormData()
        uploadData.append('file', image)
        const uploadResponse = await fetch('/api/admin/events/upload', { method: 'POST', body: uploadData })
        const uploadResult = await uploadResponse.json().catch(() => ({}))
        if (!uploadResponse.ok) throw new Error(uploadResult.error || 'Image upload failed.')
        imageUrl = uploadResult.url
      }

      const response = await fetch('/api/admin/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, image: imageUrl }),
      })
      const result = await response.json().catch(() => ({}))
      if (!response.ok) throw new Error(result.error || 'Unable to create event.')

      setEvents((current) => [...current, result].sort((a, b) => a.date.localeCompare(b.date)))
      setForm(emptyForm)
      setImage(null)
      const fileInput = document.getElementById('event-image') as HTMLInputElement | null
      if (fileInput) fileInput.value = ''
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to create event.')
    } finally {
      setSaving(false)
    }
  }

  async function updateStatus(event: AdminEvent) {
    setActionId(event.id)
    setError('')
    const response = await fetch(`/api/admin/events/${event.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isUpcoming: !event.isUpcoming }),
    })
    const result = await response.json().catch(() => ({}))
    if (response.ok) {
      setEvents((current) => current.map((item) => item.id === event.id ? result : item))
    } else {
      setError(result.error || 'Unable to update event.')
    }
    setActionId(null)
  }

  async function deleteEvent(event: AdminEvent) {
    if (!window.confirm(`Delete “${event.title}”? This cannot be undone.`)) return
    setActionId(event.id)
    setError('')
    const response = await fetch(`/api/admin/events/${event.id}`, { method: 'DELETE' })
    if (response.ok) {
      setEvents((current) => current.filter((item) => item.id !== event.id))
    } else {
      const result = await response.json().catch(() => ({}))
      setError(result.error || 'Unable to delete event.')
    }
    setActionId(null)
  }

  return (
    <section className="bg-white rounded-xl p-6 shadow-sm">
      <h2 className="text-xl font-bold text-primary mb-2">Events Management</h2>
      <p className="text-gray-600 mb-5">Create upcoming events or upload past-event highlights. They will appear automatically on the public Events page.</p>

      {error ? <div className="rounded-lg bg-red-50 p-3 text-red-700 mb-4">{error}</div> : null}

      <form onSubmit={handleSubmit} className="space-y-4 border-b border-gray-200 pb-6 mb-6">
        <div className="grid gap-4 md:grid-cols-2">
          <label className="text-sm font-medium text-gray-700">Event name
            <input required value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2" />
          </label>
          <label className="text-sm font-medium text-gray-700">Date
            <input required type="date" value={form.date} onChange={(event) => setForm({ ...form, date: event.target.value })} className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2" />
          </label>
          <label className="text-sm font-medium text-gray-700">Time
            <input required placeholder="e.g. 9:00 AM – 4:00 PM" value={form.time} onChange={(event) => setForm({ ...form, time: event.target.value })} className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2" />
          </label>
          <label className="text-sm font-medium text-gray-700">Location
            <input required value={form.location} onChange={(event) => setForm({ ...form, location: event.target.value })} className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2" />
          </label>
        </div>
        <label className="block text-sm font-medium text-gray-700">Description
          <textarea required rows={4} value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2" />
        </label>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <label className="text-sm font-medium text-gray-700">Event photo (optional)
            <input id="event-image" type="file" accept="image/*" onChange={(event) => setImage(event.target.files?.[0] ?? null)} className="mt-1 block text-sm" />
          </label>
          <label className="flex items-center gap-2 text-sm text-gray-700"><input type="checkbox" checked={form.isUpcoming} onChange={(event) => setForm({ ...form, isUpcoming: event.target.checked })} /> Upcoming event</label>
        </div>
        <button type="submit" disabled={saving} className="btn-primary px-4 py-2 disabled:opacity-50">{saving ? 'Saving...' : 'Add Event'}</button>
      </form>

      <div className="space-y-3">
        <h3 className="font-semibold text-primary">Published Events</h3>
        {loading ? <p className="text-gray-600">Loading events...</p> : null}
        {!loading && events.length === 0 ? <p className="text-gray-600">No events have been added yet.</p> : null}
        {events.map((event) => (
          <div key={event.id} className="flex flex-col gap-3 rounded-lg border border-gray-200 p-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="flex items-center gap-2"><h4 className="font-semibold text-primary">{event.title}</h4><span className="rounded-full bg-secondary px-2 py-0.5 text-xs text-primary">{event.isUpcoming ? 'Upcoming' : 'Past highlight'}</span></div>
              <p className="text-sm text-gray-600">{new Date(event.date).toLocaleDateString('en-NG')} · {event.time} · {event.location}</p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => void updateStatus(event)} disabled={actionId === event.id} className="btn-outline px-3 py-2 text-sm disabled:opacity-50">Mark {event.isUpcoming ? 'Past' : 'Upcoming'}</button>
              <button onClick={() => void deleteEvent(event)} disabled={actionId === event.id} className="btn-danger px-3 py-2 text-sm disabled:opacity-50">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
