'use client'

import { useState } from 'react'

export default function PrayerRequestPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    request: '',
    isAnonymous: false,
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    await new Promise(resolve => setTimeout(resolve, 1000))
    setIsSubmitting(false)
    setSubmitted(true)
  }

  return (
    <div className="section-padding">
      <div className="container-custom max-w-2xl">
        <h1 className="text-4xl md:text-5xl font-bold text-primary mb-4">Prayer Request</h1>
        <p className="text-xl text-gray-600 mb-8">
          Share your prayer needs with us. We are committed to praying for you.
        </p>

        {submitted ? (
          <div className="bg-green-50 text-green-700 p-8 rounded-xl text-center">
            <h3 className="font-bold text-2xl mb-2">Prayer Request Received</h3>
            <p>We are lifting your request in prayer. May God's peace be with you.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6 card p-8">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <input
                type="text"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Prayer Request</label>
              <textarea
                rows={5}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                value={formData.request}
                onChange={(e) => setFormData({ ...formData, request: e.target.value })}
              />
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="anonymous"
                checked={formData.isAnonymous}
                onChange={(e) => setFormData({ ...formData, isAnonymous: e.target.checked })}
              />
              <label htmlFor="anonymous" className="text-sm text-gray-600">
                Submit anonymously
              </label>
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-primary w-full disabled:opacity-50"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Prayer Request'}
            </button>
          </form>
        )}

        {/* Volunteer Signup Section */}
        <div className="mt-12 pt-12 border-t">
          <h2 className="text-2xl font-bold text-primary mb-4">Volunteer With Us</h2>
          <p className="text-gray-600 mb-6">
            Interested in serving as a volunteer? We would love to have you on board.
          </p>
          <a href="/contact" className="btn-accent inline-block">
            Sign Up to Volunteer
          </a>
        </div>
      </div>
    </div>
  )
}