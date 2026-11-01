import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'

import { authOptions } from '@/lib/auth'
import { ensureDefaultTestimonials } from '@/lib/testimonials'
import { prisma } from '@/lib/prisma'

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function asText(value: unknown) {
  return typeof value === 'string' ? value.trim() : ''
}

export async function GET() {
  const session = await getServerSession(authOptions)
  if (session?.user?.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  await ensureDefaultTestimonials()
  const testimonials = await prisma.testimonial.findMany({ orderBy: { createdAt: 'asc' } })
  return NextResponse.json(testimonials)
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
    return NextResponse.json({ error: 'A valid testimonial is required.' }, { status: 400 })
  }

  const name = asText(body.name)
  const role = asText(body.role)
  const content = asText(body.content)
  const isActive = body.isActive === undefined ? true : body.isActive
  if (!name || !content || typeof isActive !== 'boolean') {
    return NextResponse.json({ error: 'Name and testimonial text are required.' }, { status: 400 })
  }

  try {
    const testimonial = await prisma.testimonial.create({
      data: { name, role: role || null, content, isActive },
    })
    return NextResponse.json(testimonial, { status: 201 })
  } catch (error) {
    console.error('[TESTIMONIAL_CREATE_ERROR]', error)
    return NextResponse.json({ error: 'Unable to create testimonial.' }, { status: 500 })
  }
}
