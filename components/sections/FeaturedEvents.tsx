import Link from 'next/link'

import { prisma } from '@/lib/prisma'
import { formatEventDate } from '@/lib/events'
import { EventCard } from './EventCard'

export async function FeaturedEvents() {
  const events = await prisma.event.findMany({
    where: { isUpcoming: true },
    orderBy: { date: 'asc' },
    take: 2,
  })

  return (
    <section className="section-padding">
      <div className="container-custom">
        <div className="flex justify-between items-center mb-8">
          <h2 className="section-title mb-0">Upcoming Events</h2>
          <Link href="/events" className="text-accent hover:underline font-medium">
            View All →
          </Link>
        </div>
        {events.length ? (
          <div className="grid md:grid-cols-2 gap-8">
            {events.map((event) => (
              <EventCard
                key={event.id}
                title={event.title}
                date={formatEventDate(event.date)}
                time={event.time}
                location={event.location}
                description={event.description}
                image={event.image}
                href={`/events/${event.slug}`}
              />
            ))}
          </div>
        ) : (
          <p className="text-gray-600">No events are currently scheduled.</p>
        )}
      </div>
    </section>
  )
}
