'use client'

import { useState, useEffect } from 'react'

import { carouselTestimonials } from '@/lib/testimonials'

export function TestimonialCarousel() {
  // Renaming for clarity within the component
  const testimonials = carouselTestimonials;

  const [current, setCurrent] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % testimonials.length)
    }, 6000)
    return () => clearInterval(timer)
  }, [testimonials.length])

  return (
    <section className="section-padding bg-secondary">
      <div className="container-custom text-center">
        <h2 className="section-title">What People Are Saying</h2>
        <div className="max-w-3xl mx-auto">
          <div className="relative overflow-hidden">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className={`transition-all duration-700 ${
                  index === current ? 'opacity-100 translate-y-0' : 'opacity-0 absolute inset-0 translate-y-8'
                }`}
              >
                <p className="text-xl md:text-2xl text-gray-700 italic mb-6">
                  &quot;{testimonial.quote}&quot;
                </p>
                <p className="font-bold text-primary">{testimonial.author}</p>
                <p className="text-gray-500 text-sm">{testimonial.role}</p>
              </div>
            ))}
          </div>
          <div className="flex justify-center gap-2 mt-6">
            {testimonials.map((_, index) => (
              <button
                key={index}
                className={`w-3 h-3 rounded-full transition-colors ${
                  index === current ? 'bg-primary' : 'bg-gray-300'
                }`}
                onClick={() => setCurrent(index)}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}