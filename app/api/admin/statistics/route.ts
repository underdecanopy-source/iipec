import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'

import { authOptions } from '@/lib/auth'
import { defaultStatistics, getStatistics } from '@/lib/statistics'
import { prisma } from '@/lib/prisma'

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

export async function GET() {
  const session = await getServerSession(authOptions)
  if (session?.user?.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }
  return NextResponse.json(await getStatistics())
}

export async function PUT(request: Request) {
  const session = await getServerSession(authOptions)
  if (session?.user?.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'A valid JSON request is required.' }, { status: 400 })
  }
  if (!isRecord(body) || !Array.isArray(body.statistics)) {
    return NextResponse.json({ error: 'A statistics list is required.' }, { status: 400 })
  }

  const submitted = new Map<string, { value: string; label: string }>()
  for (const item of body.statistics) {
    if (!isRecord(item) || typeof item.id !== 'string' || typeof item.value !== 'string' || typeof item.label !== 'string') {
      return NextResponse.json({ error: 'Each statistic must have a valid ID, value, and label.' }, { status: 400 })
    }
    const value = item.value.trim()
    const label = item.label.trim()
    if (!value || !label || value.length > 40 || label.length > 80) {
      return NextResponse.json({ error: 'Statistic values and labels must be non-empty and within the length limits.' }, { status: 400 })
    }
    submitted.set(item.id, { value, label })
  }

  if (
    submitted.size !== defaultStatistics.length ||
    defaultStatistics.some((stat) => !submitted.has(stat.id))
  ) {
    return NextResponse.json({ error: 'All four default statistics must be provided.' }, { status: 400 })
  }

  try {
    await prisma.$transaction(
      defaultStatistics.map((stat) => {
        const updated = submitted.get(stat.id)
        if (!updated) throw new Error(`Missing statistic ${stat.id}`)
        const key = `impact_stat_${stat.id}`
        return prisma.siteSetting.upsert({
          where: { key },
          create: { key, value: JSON.stringify(updated) },
          update: { value: JSON.stringify(updated) },
        })
      }),
    )
    return NextResponse.json(await getStatistics())
  } catch (error) {
    console.error('[STATISTICS_UPDATE_ERROR]', error)
    return NextResponse.json({ error: 'Unable to save statistics.' }, { status: 500 })
  }
}
