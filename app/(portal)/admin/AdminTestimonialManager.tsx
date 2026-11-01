'use client'

import { FormEvent, useEffect, useState } from 'react'

type Testimonial = {
  id: string
  name: string
  role: string | null
  content: string
  isActive: boolean
}

const emptyForm = { name: '', role: '', content: '', isActive: true }

export function AdminTestimonialManager() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [form, setForm] = useState(emptyForm)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [actionId, setActionId] = useState<string | null>(null)

  useEffect(() => {
    async function loadTestimonials() {
      try {
        const response = await fetch('/api/admin/testimonials')
        const result = await response.json().catch(() => ({}))
        if (!response.ok) throw new Error(result.error || 'Unable to load testimonials.')
        setTestimonials(result)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unable to load testimonials.')
      } finally {
        setLoading(false)
      }
    }
    void loadTestimonials()
  }, [])

  function resetForm() {
    setForm(emptyForm)
    setEditingId(null)
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    setSaving(true)
    setError('')
    try {
      const response = await fetch(editingId ? `/api/admin/testimonials/${editingId}` : '/api/admin/testimonials', {
        method: editingId ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const result = await response.json().catch(() => ({}))
      if (!response.ok) throw new Error(result.error || 'Unable to save testimonial.')
      setTestimonials((current) =>
        editingId
          ? current.map((item) => item.id === editingId ? result : item)
          : [...current, result],
      )
      resetForm()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to save testimonial.')
    } finally {
      setSaving(false)
    }
  }

  function editTestimonial(testimonial: Testimonial) {
    setEditingId(testimonial.id)
    setForm({
      name: testimonial.name,
      role: testimonial.role ?? '',
      content: testimonial.content,
      isActive: testimonial.isActive,
    })
    setError('')
  }

  async function toggleActive(testimonial: Testimonial) {
    setActionId(testimonial.id)
    setError('')
    try {
      const response = await fetch(`/api/admin/testimonials/${testimonial.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !testimonial.isActive }),
      })
      const result = await response.json().catch(() => ({}))
      if (!response.ok) throw new Error(result.error || 'Unable to update testimonial.')
      setTestimonials((current) => current.map((item) => item.id === testimonial.id ? result : item))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to update testimonial.')
    } finally {
      setActionId(null)
    }
  }

  async function deleteTestimonial(testimonial: Testimonial) {
    if (!window.confirm(`Delete the testimonial from “${testimonial.name}”? This cannot be undone.`)) return
    setActionId(testimonial.id)
    setError('')
    try {
      const response = await fetch(`/api/admin/testimonials/${testimonial.id}`, { method: 'DELETE' })
      const result = await response.json().catch(() => ({}))
      if (!response.ok) throw new Error(result.error || 'Unable to delete testimonial.')
      setTestimonials((current) => current.filter((item) => item.id !== testimonial.id))
      if (editingId === testimonial.id) resetForm()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to delete testimonial.')
    } finally {
      setActionId(null)
    }
  }

  return (
    <section className="bg-white rounded-xl p-6 shadow-sm">
      <h2 className="text-xl font-bold text-primary mb-2">What People Are Saying</h2>
      <p className="text-gray-600 mb-5">Manage the testimonials shown in the homepage carousel.</p>

      {error ? <div className="rounded-lg bg-red-50 p-3 text-red-700 mb-4">{error}</div> : null}

      <form onSubmit={handleSubmit} className="space-y-4 border-b border-gray-200 pb-6 mb-6">
        <div className="grid gap-4 md:grid-cols-2">
          <label className="text-sm font-medium text-gray-700">Name
            <input required value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2" />
          </label>
          <label className="text-sm font-medium text-gray-700">Role (optional)
            <input value={form.role} onChange={(event) => setForm({ ...form, role: event.target.value })} className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2" />
          </label>
        </div>
        <label className="block text-sm font-medium text-gray-700">Testimonial
          <textarea required rows={4} value={form.content} onChange={(event) => setForm({ ...form, content: event.target.value })} className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2" />
        </label>
        <label className="flex items-center gap-2 text-sm text-gray-700">
          <input type="checkbox" checked={form.isActive} onChange={(event) => setForm({ ...form, isActive: event.target.checked })} />
          Show in homepage carousel
        </label>
        <div className="flex gap-3">
          <button type="submit" disabled={saving} className="btn-primary px-4 py-2 disabled:opacity-50">
            {saving ? 'Saving...' : editingId ? 'Save Changes' : 'Add Testimonial'}
          </button>
          {editingId ? <button type="button" onClick={resetForm} className="btn-outline px-4 py-2">Cancel</button> : null}
        </div>
      </form>

      <div className="space-y-3">
        <h3 className="font-semibold text-primary">Testimonials</h3>
        {loading ? <p className="text-gray-600">Loading testimonials...</p> : null}
        {!loading && testimonials.length === 0 ? <p className="text-gray-600">No testimonials have been added yet.</p> : null}
        {testimonials.map((testimonial) => (
          <div key={testimonial.id} className="flex flex-col gap-3 rounded-lg border border-gray-200 p-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h4 className="font-semibold text-primary">{testimonial.name}</h4>
                <span className="rounded-full bg-secondary px-2 py-0.5 text-xs text-primary">{testimonial.isActive ? 'Visible' : 'Hidden'}</span>
              </div>
              {testimonial.role ? <p className="text-sm text-gray-600">{testimonial.role}</p> : null}
              <p className="text-sm text-gray-600 mt-1">{testimonial.content}</p>
            </div>
            <div className="flex shrink-0 gap-2">
              <button onClick={() => editTestimonial(testimonial)} className="btn-outline px-3 py-2 text-sm">Edit</button>
              <button onClick={() => void toggleActive(testimonial)} disabled={actionId === testimonial.id} className="btn-outline px-3 py-2 text-sm disabled:opacity-50">
                {testimonial.isActive ? 'Hide' : 'Show'}
              </button>
              <button onClick={() => void deleteTestimonial(testimonial)} disabled={actionId === testimonial.id} className="btn-danger px-3 py-2 text-sm disabled:opacity-50">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
