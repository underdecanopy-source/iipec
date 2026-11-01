import { getActiveTestimonials } from '@/lib/testimonials'
import { TestimonialCarouselClient } from './TestimonialCarouselClient'

export async function TestimonialCarousel() {
  const testimonials = await getActiveTestimonials()
  return <TestimonialCarouselClient testimonials={testimonials} />
}