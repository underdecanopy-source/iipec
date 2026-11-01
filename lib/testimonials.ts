import { prisma } from '@/lib/prisma'

export const testimonials = [
  {
    name: 'Pastor John Adebayo',
    role: 'Chaplain, Lagos',
    content: 'The training I received through IIPEC has transformed my ministry. I now serve with greater compassion and effectiveness.',
  },
  {
    name: 'Sister Mary Okafor',
    role: 'Volunteer Chaplain',
    content: 'Being part of this movement has given me purpose and direction. I am now able to serve my community with love and excellence.',
  },
  {
    name: 'Rev. David Williams',
    role: 'Prison Ministry Coordinator',
    content: 'IIPEC equips chaplains with the skills and heart needed to make a real difference in people\'s lives.',
  },
];

export const carouselTestimonials = testimonials.map(t => ({
  quote: t.content,
  author: t.name,
  role: t.role,
}));

const seedKey = 'testimonials_seeded'

export async function ensureDefaultTestimonials() {
  if (await prisma.siteSetting.findUnique({ where: { key: seedKey }, select: { id: true } })) {
    return
  }

  try {
    await prisma.$transaction(async (transaction) => {
      if (await transaction.siteSetting.findUnique({ where: { key: seedKey }, select: { id: true } })) {
        return
      }

      if (await transaction.testimonial.count() === 0) {
        await transaction.testimonial.createMany({
          data: testimonials.map((testimonial) => ({
            name: testimonial.name,
            role: testimonial.role,
            content: testimonial.content,
            isActive: true,
          })),
        })
      }
      await transaction.siteSetting.create({ data: { key: seedKey, value: 'true' } })
    })
  } catch (error) {
    if (await prisma.siteSetting.findUnique({ where: { key: seedKey }, select: { id: true } })) {
      return
    }
    throw error
  }
}

export async function getActiveTestimonials() {
  await ensureDefaultTestimonials()
  return prisma.testimonial.findMany({
    where: { isActive: true },
    orderBy: { createdAt: 'asc' },
    select: { id: true, name: true, role: true, content: true },
  })
}
