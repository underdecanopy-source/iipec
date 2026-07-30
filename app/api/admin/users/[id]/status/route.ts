import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

const allowedStatuses = ['ACTIVE', 'SUSPENDED', 'DISABLED'] as const

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions)
  if (session?.user?.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const body = await request.json().catch(() => null)
  const status = body?.status

  if (!allowedStatuses.includes(status)) {
    return NextResponse.json({ error: 'Invalid member status' }, { status: 400 })
  }

  if (session.user.id === params.id && status !== 'ACTIVE') {
    return NextResponse.json({ error: 'You cannot suspend or disable your own account.' }, { status: 400 });
  }

  const member = await prisma.user.update({
    where: { id: params.id },
    data: { status },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      status: true,
      lastLoginAt: true,
      createdAt: true,
    },
  })

  return NextResponse.json(member)
}
