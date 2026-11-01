'use client'

import { FormEvent, useEffect, useState } from 'react'

type AdminBlogPost = {
  id: string
  title: string
  slug: string
  excerpt: string
  content: string
  image: string | null
  author: string
  published: boolean
  createdAt: string
}

type BlogPostForm = {
  title: string
  slug: string
  excerpt: string
  content: string
  image: string
  author: string
  date: string
  published: boolean
}

const emptyForm: BlogPostForm = {
  title: '',
  slug: '',
  excerpt: '',
  content: '',
  image: '',
  author: '',
  date: new Date().toISOString().slice(0, 10),
  published: true,
}

function sortPosts(posts: AdminBlogPost[]) {
  return [...posts].sort((a, b) => b.createdAt.localeCompare(a.createdAt))
}

export function AdminBlogManager() {
  const [posts, setPosts] = useState<AdminBlogPost[]>([])
  const [form, setForm] = useState(emptyForm)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [actionId, setActionId] = useState<string | null>(null)

  async function loadPosts() {
    setLoading(true)
    try {
      const response = await fetch('/api/admin/blog')
      if (!response.ok) throw new Error('Unable to load blog posts.')
      setPosts(await response.json())
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to load blog posts.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void loadPosts()
  }, [])

  function resetForm() {
    setForm({ ...emptyForm, date: new Date().toISOString().slice(0, 10) })
    setEditingId(null)
    setImageFile(null)
    const fileInput = document.getElementById('blog-image') as HTMLInputElement | null
    if (fileInput) fileInput.value = ''
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    setError('')
    setSaving(true)

    try {
      let image = form.image.trim()
      if (imageFile) {
        const uploadData = new FormData()
        uploadData.append('file', imageFile)
        const uploadResponse = await fetch('/api/admin/blog/upload', { method: 'POST', body: uploadData })
        const uploadResult = await uploadResponse.json().catch(() => ({}))
        if (!uploadResponse.ok) throw new Error(uploadResult.error || 'Image upload failed.')
        image = uploadResult.url
      }

      const response = await fetch(editingId ? `/api/admin/blog/${editingId}` : '/api/admin/blog', {
        method: editingId ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, image }),
      })
      const result = await response.json().catch(() => ({}))
      if (!response.ok) throw new Error(result.error || 'Unable to save blog post.')

      setPosts((current) => sortPosts(
        editingId
          ? current.map((post) => post.id === editingId ? result : post)
          : [...current, result],
      ))
      resetForm()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to save blog post.')
    } finally {
      setSaving(false)
    }
  }

  function editPost(post: AdminBlogPost) {
    setEditingId(post.id)
    setForm({
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt,
      content: post.content,
      image: post.image ?? '',
      author: post.author,
      date: post.createdAt.slice(0, 10),
      published: post.published,
    })
    setImageFile(null)
    const fileInput = document.getElementById('blog-image') as HTMLInputElement | null
    if (fileInput) fileInput.value = ''
    setError('')
  }

  async function togglePublished(post: AdminBlogPost) {
    setActionId(post.id)
    setError('')
    try {
      const response = await fetch(`/api/admin/blog/${post.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ published: !post.published }),
      })
      const result = await response.json().catch(() => ({}))
      if (!response.ok) throw new Error(result.error || 'Unable to update blog post.')
      setPosts((current) => current.map((item) => item.id === post.id ? result : item))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to update blog post.')
    } finally {
      setActionId(null)
    }
  }

  async function deletePost(post: AdminBlogPost) {
    if (!window.confirm(`Delete “${post.title}”? This cannot be undone.`)) return
    setActionId(post.id)
    setError('')
    try {
      const response = await fetch(`/api/admin/blog/${post.id}`, { method: 'DELETE' })
      const result = await response.json().catch(() => ({}))
      if (!response.ok) throw new Error(result.error || 'Unable to delete blog post.')
      setPosts((current) => current.filter((item) => item.id !== post.id))
      if (editingId === post.id) resetForm()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to delete blog post.')
    } finally {
      setActionId(null)
    }
  }

  return (
    <section className="bg-white rounded-xl p-6 shadow-sm">
      <h2 className="text-xl font-bold text-primary mb-2">Blog &amp; News Management</h2>
      <p className="text-gray-600 mb-5">Create and edit the stories shown on the public Blog &amp; News page.</p>

      {error ? <div className="rounded-lg bg-red-50 p-3 text-red-700 mb-4">{error}</div> : null}

      <form onSubmit={handleSubmit} className="space-y-4 border-b border-gray-200 pb-6 mb-6">
        <div className="grid gap-4 md:grid-cols-2">
          <label className="text-sm font-medium text-gray-700">Post title
            <input required value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2" />
          </label>
          <label className="text-sm font-medium text-gray-700">URL slug
            <input value={form.slug} onChange={(event) => setForm({ ...form, slug: event.target.value })} placeholder="Generated from the title if blank" className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2" />
          </label>
          <label className="text-sm font-medium text-gray-700">Author
            <input required value={form.author} onChange={(event) => setForm({ ...form, author: event.target.value })} className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2" />
          </label>
          <label className="text-sm font-medium text-gray-700">Date
            <input required type="date" value={form.date} onChange={(event) => setForm({ ...form, date: event.target.value })} className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2" />
          </label>
        </div>
        <label className="block text-sm font-medium text-gray-700">Excerpt
          <textarea required rows={2} value={form.excerpt} onChange={(event) => setForm({ ...form, excerpt: event.target.value })} className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2" />
        </label>
        <label className="block text-sm font-medium text-gray-700">Article content
          <textarea required rows={8} value={form.content} onChange={(event) => setForm({ ...form, content: event.target.value })} className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2" />
        </label>
        <div className="grid gap-4 md:grid-cols-2">
          <label className="text-sm font-medium text-gray-700">Image URL
            <input value={form.image} onChange={(event) => setForm({ ...form, image: event.target.value })} placeholder="/images/example.jpg" className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2" />
          </label>
          <label className="text-sm font-medium text-gray-700">Or upload an image
            <input id="blog-image" type="file" accept="image/*" onChange={(event) => setImageFile(event.target.files?.[0] ?? null)} className="mt-1 block w-full text-sm" />
          </label>
        </div>
        <label className="flex items-center gap-2 text-sm text-gray-700">
          <input type="checkbox" checked={form.published} onChange={(event) => setForm({ ...form, published: event.target.checked })} />
          Published on the public site
        </label>
        <div className="flex gap-3">
          <button type="submit" disabled={saving} className="btn-primary px-4 py-2 disabled:opacity-50">
            {saving ? 'Saving...' : editingId ? 'Save Changes' : 'Add Post'}
          </button>
          {editingId ? <button type="button" onClick={resetForm} className="btn-outline px-4 py-2">Cancel</button> : null}
        </div>
      </form>

      <div className="space-y-3">
        <h3 className="font-semibold text-primary">Blog Posts</h3>
        {loading ? <p className="text-gray-600">Loading blog posts...</p> : null}
        {!loading && posts.length === 0 ? <p className="text-gray-600">No blog posts have been added yet.</p> : null}
        {posts.map((post) => (
          <div key={post.id} className="flex flex-col gap-3 rounded-lg border border-gray-200 p-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h4 className="font-semibold text-primary">{post.title}</h4>
                <span className="rounded-full bg-secondary px-2 py-0.5 text-xs text-primary">{post.published ? 'Published' : 'Draft'}</span>
              </div>
              <p className="text-sm text-gray-600">{post.author} · {new Date(post.createdAt).toLocaleDateString('en-NG')}</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <button onClick={() => editPost(post)} className="btn-outline px-3 py-2 text-sm">Edit</button>
              <button onClick={() => void togglePublished(post)} disabled={actionId === post.id} className="btn-outline px-3 py-2 text-sm disabled:opacity-50">
                {post.published ? 'Unpublish' : 'Publish'}
              </button>
              <button onClick={() => void deletePost(post)} disabled={actionId === post.id} className="btn-danger px-3 py-2 text-sm disabled:opacity-50">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
