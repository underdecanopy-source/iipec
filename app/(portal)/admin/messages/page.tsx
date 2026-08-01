'use client'

import { useEffect, useState } from 'react'

type AdminMessage = {
  id: string
  name: string
  email: string
  subject: string
  message: string
  status: 'UNREAD' | 'READ' | 'REPLIED' | 'RESOLVED'
  replies: Array<{
    id: string
    content: string
    createdAt: string
    admin: { name: string | null; email: string | null }
  }>
  createdAt: string
}

type MessageStatus = 'loading' | 'idle' | 'error'

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState<AdminMessage[]>([])
  const [status, setStatus] = useState<MessageStatus>('loading')
  const [error, setError] = useState<string | null>(null)
  const [replyingTo, setReplyingTo] = useState<string | null>(null)
  const [replyText, setReplyText] = useState('')
  const [isReplySending, setIsReplySending] = useState(false)
  const [replySuccess, setReplySuccess] = useState<string | null>(null)

  const loadMessages = async () => {
    setStatus('loading')
    setError(null)

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

  useEffect(() => {
    loadMessages()
  }, [])

  const updateStatus = async (id: string, status: AdminMessage['status']) => {
    try {
      const response = await fetch(`/api/admin/messages/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      })

      if (!response.ok) {
        throw new Error('Unable to update message status.')
      }

      const updated = await response.json()
      setMessages((current) =>
        current.map((message) =>
          message.id === updated.id ? { ...message, status: updated.status } : message
        )
      )
    } catch (exception) {
      setError((exception as Error).message)
    }
  }

  const deleteMessage = async (id: string) => {
    if (!window.confirm('Delete this message? This action cannot be undone.')) {
      return
    }

    try {
      const response = await fetch(`/api/admin/messages/${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Unable to delete message.')
      }

      setMessages((current) => current.filter((message) => message.id !== id))
    } catch (exception) {
      setError((exception as Error).message)
    }
  }

  const startReply = (id: string) => {
    setReplyingTo(id)
    setReplyText('')
    setReplySuccess(null)
    setError(null)
  }

  const statusButtons = (message: AdminMessage) => {
    const statuses: AdminMessage['status'][] = ['UNREAD', 'READ', 'REPLIED', 'RESOLVED']
    return statuses.map((status) =>
      status === message.status ? null : (
        <button
          key={status}
          onClick={() => updateStatus(message.id, status)}
          className="rounded-full px-4 py-2 text-sm font-semibold bg-slate-100 text-slate-700 hover:bg-slate-200 transition"
        >
          Mark {status.charAt(0) + status.slice(1).toLowerCase()}
        </button>
      )
    )
  }

  const cancelReply = () => {
    setReplyingTo(null)
    setReplyText('')
    setReplySuccess(null)
    setError(null)
  }

  const sendReply = async (id: string) => {
    if (!replyText.trim()) {
      setError('Please enter a reply message.')
      return
    }

    setIsReplySending(true)
    setError(null)
    setReplySuccess(null)

    try {
      const response = await fetch(`/api/admin/messages/${id}/reply`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reply: replyText.trim() }),
      })

      if (!response.ok) {
        const data = await response.json().catch(() => null)
        throw new Error(data?.error || 'Unable to send reply.')
      }

      setReplySuccess('Reply sent successfully.')
      setReplyText('')
      setReplyingTo(null)
      await loadMessages()
    } catch (exception) {
      setError((exception as Error).message)
    } finally {
      setIsReplySending(false)
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-10">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-primary mb-4">Admin Messages</h1>
        <p className="text-gray-600">Review and manage unread contact form submissions.</p>
      </div>

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
                message.status === 'UNREAD' ? 'border-primary bg-primary/5' : 'border-gray-200 bg-white'
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
                <div className="flex flex-wrap justify-start gap-2 sm:justify-end">
                  {statusButtons(message)}
                  <button
                    onClick={() => startReply(message.id)}
                    className="rounded-full px-4 py-2 text-sm font-semibold bg-slate-100 text-slate-700 hover:bg-slate-200 transition"
                  >
                    Reply
                  </button>
                  <button
                    onClick={() => deleteMessage(message.id)}
                    className="rounded-full px-4 py-2 text-sm font-semibold bg-red-100 text-red-700 hover:bg-red-200 transition"
                  >
                    Delete
                  </button>
                </div>
              </div>
              <div className="mt-4 space-y-3">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-gray-700">Status:</span>
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-slate-700">
                    {message.status}
                  </span>
                </div>
                <div>
                  <span className="font-semibold text-gray-700">Message:</span>
                  <p className="mt-2 whitespace-pre-wrap text-gray-700">{message.message}</p>
                </div>

                {message.replies.length > 0 && (
                  <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                    <h3 className="text-sm font-semibold text-slate-700">Reply history</h3>
                    <div className="mt-3 space-y-3">
                      {message.replies.map((reply) => (
                        <div key={reply.id} className="rounded-lg border border-slate-200 bg-white p-4">
                          <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                            <p className="text-sm font-semibold text-slate-700">
                              {reply.admin?.name || reply.admin?.email || 'Admin'} replied
                            </p>
                            <p className="text-xs text-slate-500">
                              {new Date(reply.createdAt).toLocaleString()}
                            </p>
                          </div>
                          <p className="mt-2 text-sm text-slate-700 whitespace-pre-wrap">{reply.content}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {replyingTo === message.id && (
                <div className="mt-4 rounded-xl border border-gray-200 bg-gray-50 p-4">
                  <h3 className="text-base font-semibold text-primary">Reply to {message.name}</h3>
                  <textarea
                    rows={5}
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    className="mt-3 w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-gray-800 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                    placeholder="Write your reply here..."
                  />
                  <div className="mt-3 flex flex-wrap gap-2">
                    <button
                      onClick={() => sendReply(message.id)}
                      disabled={isReplySending}
                      className="rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary-dark disabled:opacity-50"
                    >
                      {isReplySending ? 'Sending...' : 'Send Reply'}
                    </button>
                    <button
                      type="button"
                      onClick={cancelReply}
                      className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-100"
                    >
                      Cancel
                    </button>
                  </div>
                  {replySuccess && (
                    <div className="mt-3 rounded-lg bg-green-50 p-3 text-sm text-green-700">
                      {replySuccess}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
