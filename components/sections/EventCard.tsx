import Image from 'next/image'

interface EventCardProps {
  title: string
  date: string
  time: string
  location: string
  description: string
  image: string
}

export function EventCard({ title, date, time, location, description, image }: EventCardProps) {
  return (
    <div className="card group">
      <div className="relative h-48 overflow-hidden">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>
      <div className="p-6">
        <h3 className="text-xl font-bold text-primary mb-2">{title}</h3>
        <div className="space-y-1 text-sm text-gray-500 mb-3">
          <p>📅 {date}</p>
          <p>🕐 {time}</p>
          <p>📍 {location}</p>
        </div>
        <p className="text-gray-600 text-sm mb-4">{description}</p>
        <button className="btn-accent text-sm px-4 py-2">
          Register Now
        </button>
      </div>
    </div>
  )
}