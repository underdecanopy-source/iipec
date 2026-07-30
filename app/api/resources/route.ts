import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(request: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const resources = await prisma.resource.findMany({
    where: { isMemberOnly: true },
    orderBy: { createdAt: 'desc' },
  })
  return NextResponse.json(resources)
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions)
  if (session?.user?.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  try {
    const data = await request.json()
    const resource = await prisma.resource.create({ data })
    return NextResponse.json(resource, { status: 201 })
  } catch (err) {
    console.error('Create resource error:', err)
    return NextResponse.json({ error: 'Failed to create resource' }, { status: 500 })
  }
}
