'use client'

import { useState } from 'react'
import { getSession, signIn } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'

export default function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const isRegistered = searchParams.get('registered') === 'true'
  const callbackUrl = searchParams.get('callbackUrl')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      })

      if (result?.error) {
        if (result.error === 'SUSPENDED') {
          setError('Your account is suspended. Please contact an administrator.')
        } else if (result.error === 'DISABLED') {
          setError('Your account has been disabled. Please contact an administrator.')
        } else {
          setError('Invalid email or password')
        }
        setIsLoading(false)
        return
      }

      const session = await getSession()
      const role = session?.user?.role
      const safeCallbackUrl = getSafeCallbackUrl(callbackUrl)
      const destination = safeCallbackUrl
        ? safeCallbackUrl
        : role === 'ADMIN'
          ? '/admin'
          : '/dashboard'

      router.push(destination)
      router.refresh()
    } catch {
      setError('Unable to sign in right now. Please try again.')
      setIsLoading(false)
    }
  }

  function getSafeCallbackUrl(url: string | null) {
    if (!url) {
      return null
    }

    if (url.startsWith('/')) {
      return url
    }

    try {
      const parsed = new URL(url)
      return parsed.origin === window.location.origin
        ? `${parsed.pathname}${parsed.search}${parsed.hash}`
        : null
    } catch {
      return null
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-secondary px-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-primary">Welcome Back</h1>
          <p className="text-gray-600 mt-2">Sign in to your IIPEC account</p>
        </div>

        {isRegistered && (
          <div className="bg-green-50 border border-green-200 text-green-700 p-3 rounded-lg mb-4">
            Your account was created successfully. Please sign in to continue.
          </div>
        )}

        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
            <input
              type="email"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="btn-primary w-full disabled:opacity-50"
          >
            {isLoading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p className="text-center text-sm text-gray-600 mt-6">
          Don't have an account?{' '}
          <Link href="/register" className="text-accent hover:underline font-medium">
            Register here
          </Link>
        </p>
      </div>
    </div>
  )
}
