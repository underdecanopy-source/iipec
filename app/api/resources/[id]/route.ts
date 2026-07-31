import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export const runtime = 'nodejs'

export async function DELETE(
  _request: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions)

  if (session?.user?.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  try {
    const resource = await prisma.resource.findUnique({
      where: { id: params.id },
      select: { id: true },
    })

    if (!resource) {
      return NextResponse.json({ error: 'Resource not found' }, { status: 404 })
    }

    await prisma.resource.delete({ where: { id: params.id } })

    return NextResponse.json({ message: 'Resource deleted successfully.' })
  } catch (error) {
    console.error('[RESOURCE_DELETE_ERROR]', error)
    return NextResponse.json({ error: 'Failed to delete resource' }, { status: 500 })
  }
}
