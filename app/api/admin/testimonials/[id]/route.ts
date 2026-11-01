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
    return NextResponse.json({ error: 'A valid testimonial update is required.' }, { status: 400 })
  }

  if (Object.keys(body).length === 1 && typeof body.isActive === 'boolean') {
    try {
      const testimonial = await prisma.testimonial.update({
        where: { id: params.id },
        data: { isActive: body.isActive },
      })
      return NextResponse.json(testimonial)
    } catch (error) {
      console.error('[TESTIMONIAL_STATUS_UPDATE_ERROR]', error)
      return NextResponse.json({ error: 'Unable to update testimonial.' }, { status: 500 })
    }
  }

  const name = asText(body.name)
  const role = asText(body.role)
  const content = asText(body.content)
  const isActive = body.isActive
  if (!name || !content || typeof isActive !== 'boolean') {
    return NextResponse.json({ error: 'Name and testimonial text are required.' }, { status: 400 })
  }

  try {
    const testimonial = await prisma.testimonial.update({
      where: { id: params.id },
      data: { name, role: role || null, content, isActive },
    })
    return NextResponse.json(testimonial)
  } catch (error) {
    console.error('[TESTIMONIAL_UPDATE_ERROR]', error)
    return NextResponse.json({ error: 'Unable to update testimonial.' }, { status: 500 })
  }
}

export async function DELETE(_request: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (session?.user?.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  try {
    await prisma.testimonial.delete({ where: { id: params.id } })
    return NextResponse.json({ message: 'Testimonial deleted.' })
  } catch (error) {
    console.error('[TESTIMONIAL_DELETE_ERROR]', error)
    return NextResponse.json({ error: 'Unable to delete testimonial.' }, { status: 500 })
  }
}
