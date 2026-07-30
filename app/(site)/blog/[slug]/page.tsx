import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  // In production, fetch from database
  const post = {
    title: 'The Impact of Chaplaincy in Prisons',
    slug: params.slug,
    content: `
      <p>Chaplains play a vital role in correctional facilities, providing spiritual care, counseling, and hope to inmates.</p>
      <p>IIPEC Potter's House Command is committed to training chaplains who can effectively serve in these challenging environments.</p>
      <p>Through our prison ministry programs, we equip chaplains with the skills needed to support rehabilitation and transformation.</p>
      <h3>Key Areas of Impact</h3>
      <ul>
        <li>Spiritual guidance and counseling</li>
        <li>Rehabilitation support</li>
        <li>Community reintegration assistance</li>
        <li>Hope and emotional healing</li>
      </ul>
    `,
    date: 'June 10, 2026',
    author: 'Sir Ige Olumide',
    image: '/images/blog-prison.jpg',
  }

  if (!post) {
    notFound()
  }

  return (
    <div className="section-padding">
      <div className="container-custom max-w-3xl">
        <Link href="/blog" className="text-accent hover:underline mb-4 inline-block">
          ← Back to Blog
        </Link>
        
        <div className="relative h-64 md:h-96 rounded-xl overflow-hidden mb-8">
          <Image
            src={post.image}
            alt={post.title}
            fill
            className="object-cover"
          />
        </div>
        
        <h1 className="text-3xl md:text-4xl font-bold text-primary mb-4">{post.title}</h1>
        <div className="flex items-center gap-4 text-gray-500 text-sm mb-8">
          <span>By {post.author}</span>
          <span>•</span>
          <span>{post.date}</span>
        </div>
        
        <div 
          className="prose prose-lg max-w-none text-gray-700"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
      </div>
    </div>
  )
}