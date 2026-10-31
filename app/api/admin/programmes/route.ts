import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'

import { authOptions } from '@/lib/auth'
import { getProgrammes } from '@/lib/programmes'
import { prisma } from '@/lib/prisma'

function text(value: unknown) {
  return typeof value === 'string' ? value.trim() : ''
}

async function isAdmin() {
  const session = await getServerSession(authOptions)
  return session?.user?.role === 'ADMIN'
}

export async function GET() {
  if (!await isAdmin()) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  return NextResponse.json(await getProgrammes())
}

export async function POST(request: Request) {
  if (!await isAdmin()) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  try {
    const body = await request.json()
    const title = text(body.title)
    const description = text(body.description)
    const duration = text(body.duration)
    const delivery = text(body.delivery)
    if (!title || !description || !duration || !delivery) {
      return NextResponse.json({ error: 'Title, description, duration, and delivery method are required.' }, { status: 400 })
    }

    const programme = await prisma.programme.create({
      data: {
        title,
        description,
        duration,
        delivery,
        sortOrder: typeof body.sortOrder === 'number' ? body.sortOrder : 999,
      },
    })
    return NextResponse.json(programme, { status: 201 })
  } catch (error) {
    console.error('[PROGRAMME_CREATE_ERROR]', error)
    return NextResponse.json({ error: 'Unable to create programme.' }, { status: 500 })
  }
}
