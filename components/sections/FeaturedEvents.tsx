import Link from 'next/link'

import { events } from '@/lib/content'
import { EventCard } from './EventCard'

export function FeaturedEvents() {
  return (
    <section className="section-padding">
      <div className="container-custom">
        <div className="flex justify-between items-center mb-8">
          <h2 className="section-title mb-0">Upcoming Events</h2>
          <Link href="/events" className="text-accent hover:underline font-medium">
            View All →
          </Link>
        </div>
        <div className="grid md:grid-cols-2 gap-8">
          {events.map((event) => (
            <EventCard key={event.title} {...event} />
          ))}
        </div>
      </div>
    </section>
  )
}