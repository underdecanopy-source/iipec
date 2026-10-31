import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'

import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

function text(value: unknown) {
  return typeof value === 'string' ? value.trim() : ''
}

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (session?.user?.role !== 'ADMIN') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  try {
    const body = await request.json()
    const title = text(body.title)
    const description = text(body.description)
    const duration = text(body.duration)
    const delivery = text(body.delivery)
    if (!title || !description || !duration || !delivery) {
      return NextResponse.json({ error: 'Title, description, duration, and delivery method are required.' }, { status: 400 })
    }

    const programme = await prisma.programme.update({
      where: { id: params.id },
      data: { title, description, duration, delivery },
    })
    return NextResponse.json(programme)
  } catch (error) {
    console.error('[PROGRAMME_UPDATE_ERROR]', error)
    return NextResponse.json({ error: 'Unable to update programme.' }, { status: 500 })
  }
}

export async function DELETE(_request: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (session?.user?.role !== 'ADMIN') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  try {
    await prisma.programme.delete({ where: { id: params.id } })
    return NextResponse.json({ message: 'Programme deleted.' })
  } catch (error) {
    console.error('[PROGRAMME_DELETE_ERROR]', error)
    return NextResponse.json({ error: 'Unable to delete programme.' }, { status: 500 })
  }
}
