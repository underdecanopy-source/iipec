import { prisma } from '@/lib/prisma'

export const defaultProgrammes = [
  {
    title: 'Chaplain Training Programme',
    description: 'Comprehensive training for aspiring chaplains covering pastoral care, counselling, and spiritual guidance.',
    duration: '6 months',
    delivery: 'Hybrid (Online & In-person)',
    sortOrder: 1,
  },
  {
    title: 'Prison Chaplaincy',
    description: 'Specialised training for chaplains serving in correctional facilities, focusing on rehabilitation and spiritual support.',
    duration: '4 months',
    delivery: 'In-person',
    sortOrder: 2,
  },
  {
    title: 'Evangelical Outreach',
    description: 'Training in evangelism and community outreach to share hope and compassion with those in need.',
    duration: '3 months',
    delivery: 'Online',
    sortOrder: 3,
  },
  {
    title: 'Pastoral Counselling',
    description: 'Advanced counselling skills for chaplains providing emotional and spiritual support.',
    duration: '6 months',
    delivery: 'Hybrid',
    sortOrder: 4,
  },
]

export async function getProgrammes() {
  const count = await prisma.programme.count()
  if (count === 0) {
    await prisma.programme.createMany({ data: defaultProgrammes })
  }

  return prisma.programme.findMany({
    orderBy: [{ sortOrder: 'asc' }, { createdAt: 'asc' }],
  })
}
