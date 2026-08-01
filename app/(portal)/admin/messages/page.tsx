'use client'

import { useEffect, useState } from 'react'

type AdminMessage = {
  id: string
  name: string
  email: string
  subject: string
  message: string
  isRead: boolean
  createdAt: string
}

type MessageStatus = 'loading' | 'idle' | 'error'

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState<AdminMessage[]>([])
  const [status, setStatus] = useState<MessageStatus>('loading')
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadMessages = async () => {
      try {
        const response = await fetch('/api/admin/messages')
        if (!response.ok) {
          throw new Error('Unable to load messages.')
        }
        const data = await response.json()
        setMessages(data)
        setStatus('idle')
      } catch (exception) {
        setError((exception as Error).message)
        setStatus('error')
      }
    }

    loadMessages()
  }, [])

  const toggleRead = async (id: string, currentValue: boolean) => {
    try {
      const response = await fetch(`/api/admin/messages/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isRead: !currentValue }),
      })

      if (!response.ok) {
        throw new Error('Unable to update message status.')
      }

      const updated = await response.json()
      setMessages((current) =>
        current.map((message) =>
          message.id === updated.id ? { ...message, isRead: updated.isRead } : message
        )
      )
    } catch (exception) {
      setError((exception as Error).message)
    }
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-primary mb-4">Admin Messages</h1>
      <p className="text-gray-600 mb-8">Review and manage unread contact form submissions.</p>

      {status === 'loading' ? (
        <div className="rounded-xl bg-white p-6 shadow-sm">Loading messages...</div>
      ) : status === 'error' ? (
        <div className="rounded-xl bg-red-50 p-6 text-red-700 shadow-sm">{error}</div>
      ) : (
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`rounded-xl p-6 shadow-sm border ${
                message.isRead ? 'border-gray-200 bg-white' : 'border-primary bg-primary/5'
              }`}
            >
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-primary">{message.subject}</h2>
                  <p className="text-sm text-gray-500 mt-1">
                    From {message.name} &lt;{message.email}&gt; —{' '}
                    {new Date(message.createdAt).toLocaleString()}
                  </p>
                </div>
                <button
                  onClick={() => toggleRead(message.id, message.isRead)}
                  className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                    message.isRead
                      ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      : 'bg-primary text-white hover:bg-primary-dark'
                  }`}
                >
                  Mark as {message.isRead ? 'Unread' : 'Read'}
                </button>
              </div>
              <div className="mt-4 space-y-3">
                <div>
                  <span className="font-semibold text-gray-700">Message:</span>
                  <p className="mt-2 whitespace-pre-wrap text-gray-700">{message.message}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
