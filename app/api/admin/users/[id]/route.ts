import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { enforceCsrfProtection } from '@/lib/security'

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  if (!enforceCsrfProtection(request)) {
    return NextResponse.json({ error: 'Invalid request origin.' }, { status: 403 })
  }

  const session = await getServerSession(authOptions)
  if (session?.user?.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  if (session.user.id === params.id) {
    return NextResponse.json({ error: 'You cannot delete your own account.' }, { status: 400 })
  }

  await prisma.user.delete({
    where: { id: params.id },
  })

  return NextResponse.json({ message: 'User deleted successfully' })
}