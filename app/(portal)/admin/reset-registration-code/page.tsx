'use client'

import { useState } from 'react'

export default function ResetRegistrationCodePage() {
  const [code, setCode] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setMessage('')
    setError('')

    try {
      const response = await fetch('/api/admin/reset-registration-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ newCode: code }),
      })

      const data = await response.json().catch(() => null)

      if (!response.ok) {
        throw new Error(data?.error || 'Unable to reset the registration code.')
      }

      setMessage(`Admin registration code reset successfully. New code: ${data?.code || 'generated automatically'}`)
      setCode('')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to reset the registration code.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="max-w-2xl rounded-2xl bg-white p-8 shadow-sm">
      <h1 className="text-3xl font-bold text-primary">Reset Admin Registration Code</h1>
      <p className="mt-2 text-gray-600">Use this screen to rotate the admin registration code. The change is logged in the audit trail.</p>

      {message && (
        <div className="mt-6 rounded-lg border border-green-200 bg-green-50 p-3 text-green-700">
          {message}
        </div>
      )}

      {error && (
        <div className="mt-6 rounded-lg bg-red-50 p-3 text-red-600">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">New Admin Registration Code</label>
          <input
            type="text"
            className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-primary"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Leave blank to auto-generate a fresh code"
          />
        </div>
        <button
          type="submit"
          disabled={isLoading}
          className="btn-primary disabled:opacity-50"
        >
          {isLoading ? 'Resetting...' : 'Reset Code'}
        </button>
      </form>
    </div>
  )
}
