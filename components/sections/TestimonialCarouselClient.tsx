'use client'

import { useEffect, useState } from 'react'

type Testimonial = {
  id: string
  name: string
  role: string | null
  content: string
}

export function TestimonialCarouselClient({ testimonials }: { testimonials: Testimonial[] }) {
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    if (testimonials.length < 2) return
    const timer = setInterval(() => {
      setCurrent((previous) => (previous + 1) % testimonials.length)
    }, 6000)
    return () => clearInterval(timer)
  }, [testimonials.length])

  useEffect(() => {
    setCurrent((previous) => Math.min(previous, Math.max(testimonials.length - 1, 0)))
  }, [testimonials.length])

  return (
    <section className="section-padding bg-secondary">
      <div className="container-custom text-center">
        <h2 className="section-title">What People Are Saying</h2>
        <div className="max-w-3xl mx-auto">
          {testimonials.length ? (
            <>
              <div className="relative overflow-hidden">
                {testimonials.map((testimonial, index) => (
                  <div
                    key={testimonial.id}
                    className={`transition-all duration-700 ${
                      index === current ? 'opacity-100 translate-y-0' : 'opacity-0 absolute inset-0 translate-y-8'
                    }`}
                  >
                    <p className="text-xl md:text-2xl text-gray-700 italic mb-6">
                      &quot;{testimonial.content}&quot;
                    </p>
                    <p className="font-bold text-primary">{testimonial.name}</p>
                    {testimonial.role ? <p className="text-gray-500 text-sm">{testimonial.role}</p> : null}
                  </div>
                ))}
              </div>
              {testimonials.length > 1 ? (
                <div className="flex justify-center gap-2 mt-6">
                  {testimonials.map((testimonial, index) => (
                    <button
                      key={testimonial.id}
                      type="button"
                      aria-label={`Show testimonial ${index + 1}`}
                      aria-current={index === current}
                      className={`w-3 h-3 rounded-full transition-colors ${
                        index === current ? 'bg-primary' : 'bg-gray-300'
                      }`}
                      onClick={() => setCurrent(index)}
                    />
                  ))}
                </div>
              ) : null}
            </>
          ) : <p className="text-gray-600">No testimonials are currently available.</p>}
        </div>
      </div>
    </section>
  )
}
