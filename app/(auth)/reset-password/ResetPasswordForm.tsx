'use client'

import { useFormState, useFormStatus } from 'react-dom'
import { useEffect } from 'react'

import { useSearchParams } from 'next/navigation'
import { useRouter } from 'next/navigation'
import { resetPassword } from '@/actions/auth'

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <button type="submit" disabled={pending} className="btn-primary w-full disabled:opacity-50">
      {pending ? 'Updating...' : 'Update Password'}
    </button>
  )
}

export default function ResetPasswordForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get('token')
  const [state, formAction] = useFormState(resetPassword, { error: '' })

  useEffect(() => {
    if (state.message) {
      // Redirect to login page on success
      setTimeout(() => router.push('/login?reset=true'), 2000)
    }
  }, [state.message, router])

  return (
    <form action={formAction} className="space-y-4">
      <input type="hidden" name="token" value={token || ''} />
      {state.message && (
        <div className="bg-green-50 border border-green-200 text-green-700 p-3 rounded-lg">
          {state.message}
        </div>
      )}
      {state.error && (
        <div className="bg-red-50 text-red-600 p-3 rounded-lg">{state.error}</div>
      )}
      {!state.message && (
        <>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
            <input type="password" name="password" required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
            <input type="password" name="confirmPassword" required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent" />
          </div>
          <SubmitButton />
        </>
      )}
    </form>
  )
  }