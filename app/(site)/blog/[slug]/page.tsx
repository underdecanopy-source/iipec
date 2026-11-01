import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ensureDefaultBlogPosts, formatBlogDate } from '@/lib/blog'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  await ensureDefaultBlogPosts()
  const post = await prisma.blogPost.findFirst({
    where: { slug: params.slug, published: true },
  })
  if (!post) notFound()

  return (
    <div className="section-padding">
      <div className="container-custom max-w-3xl">
        <Link href="/blog" className="text-accent hover:underline mb-4 inline-block">
          ← Back to Blog
        </Link>
        
        {post.image ? (
          <div className="relative h-64 md:h-96 rounded-xl overflow-hidden mb-8">
            <Image src={post.image} alt={post.title} fill className="object-cover" />
          </div>
        ) : null}
        
        <h1 className="text-3xl md:text-4xl font-bold text-primary mb-4">{post.title}</h1>
        <div className="flex items-center gap-4 text-gray-500 text-sm mb-8">
          <span>By {post.author}</span>
          <span>•</span>
          <span>{formatBlogDate(post.createdAt)}</span>
        </div>
        
        <div className="prose prose-lg max-w-none text-gray-700 whitespace-pre-line">{post.content}</div>
      </div>
    </div>
  )
}
