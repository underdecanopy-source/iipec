import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'

import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

function canManage(session: Awaited<ReturnType<typeof getServerSession>>) {
  return session?.user?.role === 'ADMIN'
}

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!canManage(session)) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  try {
    const body = await request.json()
    if (typeof body.isUpcoming !== 'boolean') {
      return NextResponse.json({ error: 'A valid event status is required.' }, { status: 400 })
    }
    const event = await prisma.event.update({
      where: { id: params.id },
      data: { isUpcoming: body.isUpcoming },
    })
    return NextResponse.json(event)
  } catch (error) {
    console.error('[EVENT_UPDATE_ERROR]', error)
    return NextResponse.json({ error: 'Unable to update event.' }, { status: 500 })
  }
}

export async function DELETE(_request: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!canManage(session)) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  try {
    await prisma.event.delete({ where: { id: params.id } })
    return NextResponse.json({ message: 'Event deleted.' })
  } catch (error) {
    console.error('[EVENT_DELETE_ERROR]', error)
    return NextResponse.json({ error: 'Unable to delete event.' }, { status: 500 })
  }
}
