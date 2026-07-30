import { testimonials } from '@/lib/testimonials';

export default function TestimonialsPage() {
  return (
    <div className="section-padding">
      <div className="container-custom">
        <h1 className="text-4xl md:text-5xl font-bold text-primary mb-4">Testimonials & Stories</h1>
        <p className="text-xl text-gray-600 max-w-2xl mb-12">
          Hear from those whose lives have been touched by the ministry of IIPEC Potter's House Command.
        </p>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <div key={testimonial.name} className="card p-6">
              <div className="text-accent text-4xl mb-4">"</div>
              <p className="text-gray-700 italic mb-4">{testimonial.content}</p>
              <div>
                <p className="font-bold text-primary">{testimonial.name}</p>
                <p className="text-sm text-gray-500">{testimonial.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}