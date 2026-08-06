import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { enforceCsrfProtection } from '@/lib/security'

const allowedStatuses = ['UNREAD', 'READ', 'REPLIED', 'RESOLVED'] as const

const logAudit = async (userId: string, action: string, details?: string) => {
  await prisma.auditLog.create({
    data: {
      userId,
      action,
      details,
    },
  })
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  if (!enforceCsrfProtection(request)) {
    return NextResponse.json({ error: 'Invalid request origin.' }, { status: 403 })
  }

  const session = await getServerSession(authOptions)
  if (session?.user?.role !== 'ADMIN' || !session.user?.id) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const body = await request.json().catch(() => null)
  const status = body?.status

  if (!allowedStatuses.includes(status)) {
    return NextResponse.json({ error: 'Invalid status' }, { status: 400 })
  }

  const current = await prisma.contactSubmission.findUnique({
    where: { id: params.id },
    select: { status: true },
  })

  if (!current) {
    return NextResponse.json({ error: 'Message not found.' }, { status: 404 })
  }

  const updated = await prisma.contactSubmission.update({
    where: { id: params.id },
    data: { status },
    select: {
      id: true,
      status: true,
    },
  })

  await logAudit(session.user.id, 'MESSAGE_STATUS_CHANGED', `Changed message ${params.id} status from ${current.status} to ${status}`)

  return NextResponse.json(updated)
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  if (!enforceCsrfProtection(request)) {
    return NextResponse.json({ error: 'Invalid request origin.' }, { status: 403 })
  }

  const session = await getServerSession(authOptions)
  if (session?.user?.role !== 'ADMIN' || !session.user?.id) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  await prisma.contactSubmission.delete({
    where: { id: params.id },
  })

  await logAudit(session.user.id, 'MESSAGE_DELETED', `Deleted message ${params.id}`)

  return NextResponse.json({ success: true })
}
