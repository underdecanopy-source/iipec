import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'

import { authOptions } from '@/lib/auth'
import { ensureDefaultBlogPosts } from '@/lib/blog'
import { prisma } from '@/lib/prisma'

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function asText(value: unknown) {
  return typeof value === 'string' ? value.trim() : ''
}

function parseDate(value: unknown) {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return null
  const date = new Date(`${value}T12:00:00.000Z`)
  if (Number.isNaN(date.getTime())) return null
  return date.toISOString().slice(0, 10) === value ? date : null
}

async function uniqueSlug(title: string, requestedSlug?: string) {
  const base = (requestedSlug?.trim() || title)
    .normalize('NFKD')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '') || 'blog-post'

  let slug = base
  let suffix = 2
  while (await prisma.blogPost.findUnique({ where: { slug }, select: { id: true } })) {
    slug = `${base}-${suffix++}`
  }
  return slug
}

export async function GET() {
  const session = await getServerSession(authOptions)
  if (session?.user?.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  await ensureDefaultBlogPosts()
  const posts = await prisma.blogPost.findMany({ orderBy: { createdAt: 'desc' } })
  return NextResponse.json(posts)
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions)
  if (session?.user?.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'A valid JSON request is required.' }, { status: 400 })
  }
  if (!isRecord(body)) {
    return NextResponse.json({ error: 'A valid blog post is required.' }, { status: 400 })
  }

  const title = asText(body.title)
  const excerpt = asText(body.excerpt)
  const content = asText(body.content)
  const author = asText(body.author)
  const date = parseDate(body.date)
  const image = typeof body.image === 'string' ? body.image.trim() || null : null
  const published = body.published === undefined ? true : body.published

  if (!title || !excerpt || !content || !author || !date || typeof published !== 'boolean') {
    return NextResponse.json({ error: 'Title, excerpt, content, author, and a valid date are required.' }, { status: 400 })
  }

  try {
    const post = await prisma.blogPost.create({
      data: {
        title,
        slug: await uniqueSlug(title, asText(body.slug)),
        excerpt,
        content,
        author,
        image,
        published,
        createdAt: date,
      },
    })
    return NextResponse.json(post, { status: 201 })
  } catch (error) {
    console.error('[BLOG_POST_CREATE_ERROR]', error)
    return NextResponse.json({ error: 'Unable to create blog post.' }, { status: 500 })
  }
}
