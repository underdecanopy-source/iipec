import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'

import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

function asText(value: unknown) {
  return typeof value === 'string' ? value.trim() : ''
}

async function uniqueSlug(title: string) {
  const base = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '') || 'event'

  let slug = base
  let suffix = 2
  while (await prisma.event.findUnique({ where: { slug }, select: { id: true } })) {
    slug = `${base}-${suffix++}`
  }
  return slug
}

export async function GET() {
  const session = await getServerSession(authOptions)
  if (session?.user?.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const events = await prisma.event.findMany({
    orderBy: [{ isUpcoming: 'desc' }, { date: 'asc' }],
  })
  return NextResponse.json(events)
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions)
  if (session?.user?.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  try {
    const body = await request.json()
    const title = asText(body.title)
    const description = asText(body.description)
    const time = asText(body.time)
    const location = asText(body.location)
    const image = asText(body.image) || null
    const date = new Date(asText(body.date))

    if (!title || !description || !time || !location || Number.isNaN(date.getTime())) {
      return NextResponse.json({ error: 'Title, date, time, location, and description are required.' }, { status: 400 })
    }

    const event = await prisma.event.create({
      data: {
        title,
        slug: await uniqueSlug(title),
        description,
        date,
        time,
        location,
        image,
        isUpcoming: body.isUpcoming !== false,
      },
    })

    return NextResponse.json(event, { status: 201 })
  } catch (error) {
    console.error('[EVENT_CREATE_ERROR]', error)
    return NextResponse.json({ error: 'Unable to create event.' }, { status: 500 })
  }
}
