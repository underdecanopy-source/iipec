'use client'

import { FormEvent, useEffect, useState } from 'react'

type Programme = {
  id: string
  title: string
  description: string
  duration: string
  delivery: string
  sortOrder: number
}

const emptyForm = {
  title: '',
  description: '',
  duration: '',
  delivery: '',
}

export function AdminProgrammeManager() {
  const [programmes, setProgrammes] = useState<Programme[]>([])
  const [form, setForm] = useState(emptyForm)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  async function loadProgrammes() {
    setLoading(true)
    const response = await fetch('/api/admin/programmes')
    if (!response.ok) {
      setError('Unable to load programmes.')
    } else {
      setProgrammes(await response.json())
    }
    setLoading(false)
  }

  useEffect(() => {
    void loadProgrammes()
  }, [])

  function startEdit(programme: Programme) {
    setEditingId(programme.id)
    setForm({
      title: programme.title,
      description: programme.description,
      duration: programme.duration,
      delivery: programme.delivery,
    })
    setError('')
  }

  function cancelEdit() {
    setEditingId(null)
    setForm(emptyForm)
  }

  async function saveProgramme(event: FormEvent) {
    event.preventDefault()
    setSaving(true)
    setError('')

    try {
      const response = await fetch(editingId ? `/api/admin/programmes/${editingId}` : '/api/admin/programmes', {
        method: editingId ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const result = await response.json().catch(() => ({}))
      if (!response.ok) throw new Error(result.error || 'Unable to save programme.')

      setProgrammes((current) => editingId
        ? current.map((programme) => programme.id === editingId ? result : programme)
        : [...current, result]
      )
      cancelEdit()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to save programme.')
    } finally {
      setSaving(false)
    }
  }

  async function deleteProgramme(programme: Programme) {
    if (!window.confirm(`Delete “${programme.title}”? This cannot be undone.`)) return
    setDeletingId(programme.id)
    setError('')
    const response = await fetch(`/api/admin/programmes/${programme.id}`, { method: 'DELETE' })
    if (response.ok) {
      setProgrammes((current) => current.filter((item) => item.id !== programme.id))
    } else {
      const result = await response.json().catch(() => ({}))
      setError(result.error || 'Unable to delete programme.')
    }
    setDeletingId(null)
  }

  return (
    <section className="bg-white rounded-xl p-6 shadow-sm">
      <h2 className="text-xl font-bold text-primary mb-2">Programmes Management</h2>
      <p className="text-gray-600 mb-5">Update the public training programmes or add new offerings. The four supplied programmes are loaded automatically as the initial entries.</p>

      {error ? <div className="rounded-lg bg-red-50 p-3 text-red-700 mb-4">{error}</div> : null}

      <form onSubmit={saveProgramme} className="space-y-4 border-b border-gray-200 pb-6 mb-6">
        <div className="grid gap-4 md:grid-cols-2">
          <label className="text-sm font-medium text-gray-700">Programme title
            <input required value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2" />
          </label>
          <label className="text-sm font-medium text-gray-700">Duration
            <input required placeholder="e.g. 6 months" value={form.duration} onChange={(event) => setForm({ ...form, duration: event.target.value })} className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2" />
          </label>
        </div>
        <label className="block text-sm font-medium text-gray-700">Description
          <textarea required rows={3} value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2" />
        </label>
        <label className="block text-sm font-medium text-gray-700">Delivery method
          <input required placeholder="e.g. Hybrid (Online & In-person)" value={form.delivery} onChange={(event) => setForm({ ...form, delivery: event.target.value })} className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2" />
        </label>
        <div className="flex gap-3">
          <button type="submit" disabled={saving} className="btn-primary px-4 py-2 disabled:opacity-50">{saving ? 'Saving...' : editingId ? 'Save Changes' : 'Add Programme'}</button>
          {editingId ? <button type="button" onClick={cancelEdit} className="btn-outline px-4 py-2">Cancel</button> : null}
        </div>
      </form>

      <div className="space-y-3">
        <h3 className="font-semibold text-primary">Published Programmes</h3>
        {loading ? <p className="text-gray-600">Loading programmes...</p> : null}
        {!loading && programmes.length === 0 ? <p className="text-gray-600">No programmes have been added yet.</p> : null}
        {programmes.map((programme) => (
          <div key={programme.id} className="flex flex-col gap-3 rounded-lg border border-gray-200 p-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h4 className="font-semibold text-primary">{programme.title}</h4>
              <p className="text-sm text-gray-600">{programme.duration} · {programme.delivery}</p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => startEdit(programme)} className="btn-outline px-3 py-2 text-sm">Edit</button>
              <button onClick={() => void deleteProgramme(programme)} disabled={deletingId === programme.id} className="btn-danger px-3 py-2 text-sm disabled:opacity-50">{deletingId === programme.id ? 'Deleting...' : 'Delete'}</button>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
