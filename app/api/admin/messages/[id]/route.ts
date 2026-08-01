import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions)
  if (session?.user?.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const body = await request.json().catch(() => null)
  const isRead = body?.isRead

  if (typeof isRead !== 'boolean') {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
  }

  const updated = await prisma.contactSubmission.update({
    where: { id: params.id },
    data: { isRead },
    select: {
      id: true,
      isRead: true,
    },
  })

  return NextResponse.json(updated)
}
