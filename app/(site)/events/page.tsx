import { EventCard } from '@/components/sections/EventCard'

export default function EventsPage() {
  const events = [
    {
      title: 'Annual Chaplain Conference',
      date: 'August 15-17, 2026',
      time: '9:00 AM - 5:00 PM',
      location: 'Lagos, Nigeria',
      description: 'Join chaplains from across Africa for a time of training, fellowship, and spiritual renewal.',
      image: '/images/event-conference.jpg',
    },
    {
      title: 'Prison Ministry Training',
      date: 'September 5-6, 2026',
      time: '10:00 AM - 4:00 PM',
      location: 'Abuja, Nigeria',
      description: 'Specialized training for chaplains serving in correctional facilities.',
      image: '/images/event-prison.jpg',
    },
    {
      title: 'Community Outreach Program',
      date: 'October 10, 2026',
      time: '8:00 AM - 2:00 PM',
      location: 'Ibadan, Nigeria',
      description: 'Serving communities with compassion through practical outreach and spiritual care.',
      image: '/images/event-outreach.jpg',
    },
  ]

  return (
    <div className="section-padding">
      <div className="container-custom">
        <h1 className="text-4xl md:text-5xl font-bold text-primary mb-4">Events</h1>
        <p className="text-xl text-gray-600 max-w-2xl mb-12">
          Join us for upcoming events, training sessions, and community gatherings.
        </p>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {events.map((event) => (
            <EventCard key={event.title} {...event} />
          ))}
        </div>
      </div>
    </div>
  )
}