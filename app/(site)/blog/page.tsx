import Link from 'next/link'
import Image from 'next/image'

export default function BlogPage() {
  const posts = [
    {
      title: 'The Impact of Chaplaincy in Prisons',
      slug: 'impact-of-chaplaincy-in-prisons',
      excerpt: 'Discover how chaplains are making a difference in correctional facilities across Nigeria.',
      date: 'June 10, 2026',
      author: 'Sir Ige Olumide',
      image: '/images/blog-prison.jpg',
    },
    {
      title: 'Equipping Chaplains for Excellence',
      slug: 'equipping-chaplains-for-excellence',
      excerpt: 'A look at our training programs and how they prepare chaplains for effective ministry.',
      date: 'June 5, 2026',
      author: 'Chap. Dr. Isaac Okpuzor',
      image: '/images/blog-training.jpg',
    },
    {
      title: 'Serving with Compassion in Communities',
      slug: 'serving-with-compassion',
      excerpt: 'How IIPEC is reaching communities with love and practical support.',
      date: 'May 28, 2026',
      author: 'Chap. Dr. Rebecca Okpuzor',
      image: '/images/blog-community.jpg',
    },
  ]

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
                <Image
                  src={post.image}
                  alt={post.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-primary mb-2 group-hover:text-accent transition-colors">
                  {post.title}
                </h3>
                <p className="text-gray-600 text-sm mb-3">{post.excerpt}</p>
                <div className="flex justify-between text-sm text-gray-500">
                  <span>{post.author}</span>
                  <span>{post.date}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}