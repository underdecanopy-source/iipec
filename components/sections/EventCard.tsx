import Image from 'next/image'
import Link from 'next/link'

interface EventCardProps {
  title: string
  date: string
  time: string
  location: string
  description: string
  image?: string | null
  href?: string
}

export function EventCard({ title, date, time, location, description, image, href }: EventCardProps) {
  return (
    <div className="card group">
      {image ? (
        <div className="relative h-48 overflow-hidden">
          <Image
            src={image}
            alt={title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
      ) : (
        <div className="h-24 bg-primary/10" aria-hidden="true" />
      )}
      <div className="p-6">
        <h3 className="text-xl font-bold text-primary mb-2">{title}</h3>
        <div className="space-y-1 text-sm text-gray-500 mb-3">
          <p>📅 {date}</p>
          <p>🕐 {time}</p>
          <p>📍 {location}</p>
        </div>
        <p className="text-gray-600 text-sm mb-4">{description}</p>
        {href ? <Link href={href} className="btn-accent inline-block text-sm px-4 py-2">View Details</Link> : null}
      </div>
    </div>
  )
}
