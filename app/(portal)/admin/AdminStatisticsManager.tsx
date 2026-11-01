'use client'

import { useEffect, useState } from 'react'

type Statistic = {
  id: string
  value: string
  label: string
}

export function AdminStatisticsManager() {
  const [statistics, setStatistics] = useState<Statistic[]>([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    async function loadStatistics() {
      try {
        const response = await fetch('/api/admin/statistics')
        const result = await response.json().catch(() => ({}))
        if (!response.ok) throw new Error(result.error || 'Unable to load statistics.')
        setStatistics(result)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unable to load statistics.')
      } finally {
        setLoading(false)
      }
    }
    void loadStatistics()
  }, [])

  function updateStatistic(id: string, field: 'value' | 'label', value: string) {
    setStatistics((current) =>
      current.map((stat) => stat.id === id ? { ...stat, [field]: value } : stat),
    )
  }

  async function saveStatistics() {
    setSaving(true)
    setError('')
    try {
      const response = await fetch('/api/admin/statistics', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ statistics }),
      })
      const result = await response.json().catch(() => ({}))
      if (!response.ok) throw new Error(result.error || 'Unable to save statistics.')
      setStatistics(result)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to save statistics.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <section className="bg-white rounded-xl p-6 shadow-sm">
      <h2 className="text-xl font-bold text-primary mb-2">Homepage &amp; About Statistics</h2>
      <p className="text-gray-600 mb-5">Update the four statistics displayed on both the homepage and About page.</p>

      {error ? <div className="rounded-lg bg-red-50 p-3 text-red-700 mb-4">{error}</div> : null}
      {loading ? <p className="text-gray-600">Loading statistics...</p> : (
        <div className="space-y-4">
          {statistics.map((stat) => (
            <div key={stat.id} className="grid gap-4 md:grid-cols-2">
              <label className="text-sm font-medium text-gray-700">
                Statistic value
                <input
                  required
                  maxLength={40}
                  value={stat.value}
                  onChange={(event) => updateStatistic(stat.id, 'value', event.target.value)}
                  className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2"
                />
              </label>
              <label className="text-sm font-medium text-gray-700">
                Label
                <input
                  required
                  maxLength={80}
                  value={stat.label}
                  onChange={(event) => updateStatistic(stat.id, 'label', event.target.value)}
                  className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2"
                />
              </label>
            </div>
          ))}
          <button type="button" onClick={() => void saveStatistics()} disabled={saving} className="btn-primary px-4 py-2 disabled:opacity-50">
            {saving ? 'Saving...' : 'Save Statistics'}
          </button>
        </div>
      )}
    </section>
  )
}
