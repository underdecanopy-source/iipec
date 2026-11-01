import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'

import { authOptions } from '@/lib/auth'
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

async function uniqueSlug(title: string, requestedSlug: string, id: string) {
  const base = (requestedSlug.trim() || title)
    .normalize('NFKD')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '') || 'blog-post'

  let slug = base
  let suffix = 2
  while (await prisma.blogPost.findFirst({
    where: { slug, id: { not: id } },
    select: { id: true },
  })) {
    slug = `${base}-${suffix++}`
  }
  return slug
}

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
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
    return NextResponse.json({ error: 'A valid blog post update is required.' }, { status: 400 })
  }

  if (Object.keys(body).length === 1 && typeof body.published === 'boolean') {
    try {
      const post = await prisma.blogPost.update({
        where: { id: params.id },
        data: { published: body.published },
      })
      return NextResponse.json(post)
    } catch (error) {
      console.error('[BLOG_POST_STATUS_UPDATE_ERROR]', error)
      return NextResponse.json({ error: 'Unable to update blog post.' }, { status: 500 })
    }
  }

  const title = asText(body.title)
  const excerpt = asText(body.excerpt)
  const content = asText(body.content)
  const author = asText(body.author)
  const date = parseDate(body.date)
  const image = typeof body.image === 'string' ? body.image.trim() || null : null
  const published = body.published

  if (!title || !excerpt || !content || !author || !date || typeof published !== 'boolean') {
    return NextResponse.json({ error: 'Title, excerpt, content, author, and a valid date are required.' }, { status: 400 })
  }

  try {
    const post = await prisma.blogPost.update({
      where: { id: params.id },
      data: {
        title,
        slug: await uniqueSlug(title, asText(body.slug), params.id),
        excerpt,
        content,
        author,
        image,
        published,
        createdAt: date,
      },
    })
    return NextResponse.json(post)
  } catch (error) {
    console.error('[BLOG_POST_UPDATE_ERROR]', error)
    return NextResponse.json({ error: 'Unable to update blog post.' }, { status: 500 })
  }
}

export async function DELETE(_request: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (session?.user?.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  try {
    await prisma.blogPost.delete({ where: { id: params.id } })
    return NextResponse.json({ message: 'Blog post deleted.' })
  } catch (error) {
    console.error('[BLOG_POST_DELETE_ERROR]', error)
    return NextResponse.json({ error: 'Unable to delete blog post.' }, { status: 500 })
  }
}
