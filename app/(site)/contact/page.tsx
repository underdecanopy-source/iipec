'use client'

import { useState } from 'react'

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  const handleChange =
    (field: keyof typeof formData) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setFormData({ ...formData, [field]: e.target.value })
    }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setErrorMessage('')

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const result = await response.json().catch(() => null)

      if (!response.ok) {
        throw new Error(result?.error || 'Failed to send message.')
      }

      setSubmitted(true)
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: '',
      })
    } catch (error) {
      console.error(error)
      setErrorMessage(
        error instanceof Error
          ? error.message
          : 'Failed to send message. Please try again.'
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="section-padding overflow-x-hidden">
      <div className="container-custom">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-primary mb-4">Contact Us</h1>
        <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mb-10 md:mb-12">
          Get in touch with us. We would love to hear from you.
        </p>

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(280px,0.85fr)] lg:gap-12">
          <div className="min-w-0">
            <h2 className="text-2xl font-bold text-primary mb-4">Send us a Message</h2>
            {submitted ? (
              <div className="bg-green-50 text-green-700 p-5 sm:p-6 rounded-lg">
                <h3 className="font-bold text-lg">Message Sent!</h3>
                <p>Thank you for contacting us. We will get back to you shortly.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="w-full max-w-full space-y-4 rounded-lg bg-white">
                {errorMessage ? (
                  <div className="rounded-lg bg-red-50 p-4 text-sm text-red-700">
                    {errorMessage}
                  </div>
                ) : null}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                  <input
                    type="text"
                    required
                    className="block w-full min-w-0 max-w-full rounded-lg border border-gray-300 px-4 py-3 text-base focus:border-transparent focus:ring-2 focus:ring-primary"
                    value={formData.name}
                    onChange={handleChange('name')}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    required
                    className="block w-full min-w-0 max-w-full rounded-lg border border-gray-300 px-4 py-3 text-base focus:border-transparent focus:ring-2 focus:ring-primary"
                    value={formData.email}
                    onChange={handleChange('email')}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                  <input
                    type="text"
                    required
                    className="block w-full min-w-0 max-w-full rounded-lg border border-gray-300 px-4 py-3 text-base focus:border-transparent focus:ring-2 focus:ring-primary"
                    value={formData.subject}
                    onChange={handleChange('subject')}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                  <textarea
                    rows={5}
                    required
                    className="block w-full min-w-0 max-w-full resize-y rounded-lg border border-gray-300 px-4 py-3 text-base focus:border-transparent focus:ring-2 focus:ring-primary"
                    value={formData.message}
                    onChange={handleChange('message')}
                  />
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-primary block w-full max-w-full disabled:opacity-50"
                >
                  {isSubmitting ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            )}
          </div>

          <div className="min-w-0">
            <h2 className="text-2xl font-bold text-primary mb-4">Get in Touch</h2>
            <div className="space-y-4 text-gray-600">
              <div className="flex items-start gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-secondary text-accent">
                  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 21s-6-4.35-6-10a6 6 0 1 1 12 0c0 5.65-6 10-6 10Z" /><circle cx="12" cy="11" r="2.5" /></svg>
                </span>
                <div className="min-w-0">
                  <p className="font-medium">Address</p>
                  <p className="break-words">Bethpage Alata Village, Adebayo, Off Ijebu Express Way, Ibadan, Oyo State.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-secondary text-accent">
                  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M4 5h16a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1Z" /><path d="m5 7 7 6 7-6" /></svg>
                </span>
                <div className="min-w-0">
                  <p className="font-medium">Email</p>
                  <p className="break-words">info@iipecphc.org</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-secondary text-accent">
                  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L14 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 5a2 2 0 0 1 2-2Z" /></svg>
                </span>
                <div className="min-w-0">
                  <p className="font-medium">Phone</p>
                  <p>+234 803 404 5856</p>
                </div>
              </div>
            </div>

            <div className="mt-8">
              <h3 className="font-bold text-primary mb-3">Follow Us</h3>
              <div className="flex flex-wrap gap-x-4 gap-y-2">
                <a href="https://web.facebook.com/profile.php?id=61580019583250" target="_blank" rel="noopener noreferrer" className="text-primary hover:text-accent transition-colors">
                  Facebook
                </a>
                <a href="https://x.com/iipec_phcommand" target="_blank" rel="noopener noreferrer" className="text-primary hover:text-accent transition-colors">
                  Twitter
                </a>
                <a href="https://www.instagram.com/iipecpottershousecommand?igsh=MWp2MDdscjJwdHcxaQ%3D%3D" target="_blank" rel="noopener noreferrer" className="text-primary hover:text-accent transition-colors">
                  Instagram
                </a>
                <a href="https://www.youtube.com/@iipec-pottershousecommand" target="_blank" rel="noopener noreferrer" className="text-primary hover:text-accent transition-colors">
                  YouTube
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
