import type { Event } from '@prisma/client'

export function formatEventDate(date: Date) {
  return new Intl.DateTimeFormat('en-NG', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'Africa/Lagos',
  }).format(date)
}

export type EventSummary = Pick<Event, 'id' | 'slug' | 'title' | 'description' | 'date' | 'time' | 'location' | 'image'>
