import Link from 'next/link'
import Image from 'next/image'
import { ensureDefaultBlogPosts, formatBlogDate } from '@/lib/blog'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export default async function BlogPage() {
  await ensureDefaultBlogPosts()
  const posts = await prisma.blogPost.findMany({
    where: { published: true },
    orderBy: { createdAt: 'desc' },
  })

  return (
    <div className="section-padding">
      <div className="container-custom">
        <h1 className="text-4xl md:text-5xl font-bold text-primary mb-4">Blog & News</h1>
        <p className="text-xl text-gray-600 max-w-2xl mb-12">
          Stay updated with the latest news, stories, and insights from IIPEC Potter's House Command.
        </p>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post) => (
            <Link key={post.slug} href={`/blog/${post.slug}`} className="card group">
              <div className="relative h-48 overflow-hidden">
                {post.image ? (
                  <Image
                    src={post.image}
                    alt={post.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : <div className="h-full bg-secondary" />}
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-primary mb-2 group-hover:text-accent transition-colors">
                  {post.title}
                </h3>
                <p className="text-gray-600 text-sm mb-3">{post.excerpt}</p>
                <div className="flex justify-between text-sm text-gray-500">
                  <span>{post.author}</span>
                  <span>{formatBlogDate(post.createdAt)}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
