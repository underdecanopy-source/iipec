import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { formatEventDate } from '@/lib/events'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export default async function EventDetailsPage({ params }: { params: { slug: string } }) {
  const event = await prisma.event.findUnique({ where: { slug: params.slug } })

  if (!event) notFound()

  return (
    <div className="section-padding">
      <article className="container-custom max-w-4xl">
        <Link href="/events" className="text-accent hover:underline">← All events</Link>
        <h1 className="text-4xl md:text-5xl font-bold text-primary mt-4 mb-6">{event.title}</h1>
        {event.image ? (
          <div className="relative h-64 md:h-96 rounded-xl overflow-hidden shadow-lg mb-8">
            <Image src={event.image} alt={event.title} fill className="object-cover" priority />
          </div>
        ) : null}
        <div className="rounded-xl bg-secondary p-6 mb-8 text-gray-700 space-y-2">
          <p><strong>Date:</strong> {formatEventDate(event.date)}</p>
          <p><strong>Time:</strong> {event.time}</p>
          <p><strong>Location:</strong> {event.location}</p>
        </div>
        <p className="text-lg text-gray-700 whitespace-pre-line mb-8">{event.description}</p>
        {event.isUpcoming ? <Link href="/contact" className="btn-accent inline-block">Register Your Interest</Link> : null}
      </article>
    </div>
  )
}
