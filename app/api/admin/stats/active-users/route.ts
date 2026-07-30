import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const session = await getServerSession(authOptions)
  if (session?.user?.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

  const monthlyActiveUsers = await prisma.user.count({
    where: {
      role: 'MEMBER',
      status: 'ACTIVE',
      lastLoginAt: { gte: thirtyDaysAgo },
    },
  })

  return NextResponse.json({ monthlyActiveUsers })
}
