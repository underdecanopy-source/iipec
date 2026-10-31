import Link from 'next/link'

import { EventCard } from '@/components/sections/EventCard'
import { formatEventDate } from '@/lib/events'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export default async function EventsPage() {
  const [upcomingEvents, pastEvents] = await Promise.all([
    prisma.event.findMany({ where: { isUpcoming: true }, orderBy: { date: 'asc' } }),
    prisma.event.findMany({ where: { isUpcoming: false }, orderBy: { date: 'desc' } }),
  ])

  return (
    <div className="section-padding">
      <div className="container-custom">
        <header className="max-w-3xl mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-primary mb-4">Events</h1>
          <p className="text-xl font-medium text-gray-700 mb-4">Where the Mission Comes Alive</p>
          <p className="text-gray-600">Our events are not just gatherings, they are milestones, demonstrations, and declarations of the work God is doing through IIPEC Potter’s House Command.</p>
        </header>

        <section className="mb-16">
          <h2 className="section-title">Upcoming Events</h2>
          {upcomingEvents.length ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {upcomingEvents.map((event) => (
                <EventCard key={event.id} title={event.title} date={formatEventDate(event.date)} time={event.time} location={event.location} description={event.description} image={event.image} href={`/events/${event.slug}`} />
              ))}
            </div>
          ) : <p className="text-gray-600">No events are currently scheduled.</p>}
        </section>

        <section className="grid lg:grid-cols-2 gap-10 mb-16">
          <div>
            <h2 className="text-2xl font-bold text-primary mb-4">Our Activities</h2>
            <p className="text-gray-600 mb-4">We regularly organise a range of activities including:</p>
            <ul className="space-y-2 text-gray-600">
              <li>• Chaplaincy outreach programmes</li>
              <li>• Hospital and healthcare facility visits</li>
              <li>• Passing-out and graduation parades</li>
              <li>• Set orientation sessions for new chaplain cohorts</li>
              <li>• Ranking and decoration ceremonies</li>
              <li>• Inter-agency community service activities</li>
            </ul>
          </div>
          <p className="self-end text-gray-600">Check back soon for our upcoming schedule, or follow us on our social media platforms to be the first to know when new events are announced.</p>
        </section>

        <section className="mb-16">
          <h2 className="section-title">Past Highlights</h2>
          <p className="text-gray-600 max-w-3xl mb-8">Our events have taken us into hospitals, communities, and institutions across the region. From the commissioning of new sets of chaplains to joint outreach missions with the Jesus Rescue Squad Evangelism Team, each event represents lives touched and a mission advancing.</p>
          {pastEvents.length ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {pastEvents.map((event) => (
                <EventCard key={event.id} title={event.title} date={formatEventDate(event.date)} time={event.time} location={event.location} description={event.description} image={event.image} href={`/events/${event.slug}`} />
              ))}
            </div>
          ) : <p className="text-gray-600">Past event highlights will appear here as they are added by the Command.</p>}
        </section>

        <section className="rounded-xl bg-secondary p-8 md:p-10">
          <h2 className="text-2xl font-bold text-primary mb-4">Want to Host Us?</h2>
          <p className="text-gray-600 max-w-3xl mb-6">If you are a hospital, school, correctional facility, or organisation that would like to invite IIPEC Chaplains for an outreach or chaplaincy service, we would be glad to hear from you.</p>
          <Link href="/contact" className="btn-primary inline-block">Contact Us</Link>
        </section>
      </div>
    </div>
  )
}
