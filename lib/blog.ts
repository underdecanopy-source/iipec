import { prisma } from '@/lib/prisma'

const defaultBlogPosts = [
  {
    title: 'The Impact of Chaplaincy in Prisons',
    slug: 'impact-of-chaplaincy-in-prisons',
    excerpt: 'Discover how chaplains are making a difference in correctional facilities across Nigeria.',
    content: `Chaplains play a vital role in correctional facilities, providing spiritual care, counselling, and hope to inmates.

IIPEC Potter's House Command is committed to training chaplains who can effectively serve in these challenging environments.

Through our prison ministry programmes, we equip chaplains with the skills needed to support rehabilitation and transformation.

Key Areas of Impact

- Spiritual guidance and counselling
- Rehabilitation support
- Community reintegration assistance
- Hope and emotional healing`,
    author: 'Sir Ige Olumide',
    image: '/images/blog-prison.jpg',
    published: true,
    createdAt: new Date('2026-06-10T12:00:00.000Z'),
  },
  {
    title: 'Equipping Chaplains for Excellence',
    slug: 'equipping-chaplains-for-excellence',
    excerpt: 'A look at our training programmes and how they prepare chaplains for effective ministry.',
    content: `IIPEC's training programmes equip chaplains with the knowledge and practical skills needed for effective pastoral service.

Through structured learning, mentorship, and field experience, chaplains are prepared to serve with compassion and excellence in a range of settings.`,
    author: 'Chap. Dr. Isaac Okpuzor',
    image: '/images/blog-training.jpg',
    published: true,
    createdAt: new Date('2026-06-05T12:00:00.000Z'),
  },
  {
    title: 'Serving with Compassion in Communities',
    slug: 'serving-with-compassion',
    excerpt: 'How IIPEC is reaching communities with love and practical support.',
    content: `IIPEC chaplains serve communities with compassion, offering pastoral care alongside practical support.

By listening, building relationships, and responding to local needs, our teams work to bring encouragement and hope to the people they serve.`,
    author: 'Chap. Dr. Rebecca Okpuzor',
    image: '/images/blog-community.jpg',
    published: true,
    createdAt: new Date('2026-05-28T12:00:00.000Z'),
  },
]

export async function ensureDefaultBlogPosts() {
  const key = 'blog_posts_seeded'
  if (await prisma.siteSetting.findUnique({ where: { key }, select: { id: true } })) {
    return
  }

  try {
    await prisma.$transaction(async (transaction) => {
      if (await transaction.siteSetting.findUnique({ where: { key }, select: { id: true } })) {
        return
      }

      await transaction.blogPost.createMany({
        data: defaultBlogPosts,
        skipDuplicates: true,
      })
      await transaction.siteSetting.create({ data: { key, value: 'true' } })
    })
  } catch (error) {
    if (await prisma.siteSetting.findUnique({ where: { key }, select: { id: true } })) {
      return
    }
    throw error
  }
}

export function formatBlogDate(date: Date) {
  return new Intl.DateTimeFormat('en-NG', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'Africa/Lagos',
  }).format(date)
}
