import Link from 'next/link'
import Image from 'next/image'
import { Hero } from '@/components/sections/Hero'
import { Stats } from '@/components/sections/Stats'
import { TestimonialCarousel } from '@/components/sections/TestimonialCarousel'
import { FeaturedEvents } from '@/components/sections/FeaturedEvents'

export default function HomePage() {
  return (
    <>
      <Hero />
      <Stats />
      <FeaturedEvents />
      
      {/* Mission Section */}
      <section className="section-padding bg-secondary">
        <div className="container-custom">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="section-title">Our Mission</h2>
              <p className="text-lg text-gray-700 mb-6">
                Be part of a growing movement equipping chaplains to serve with excellence and compassion.
              </p>
              <p className="text-gray-600 mb-8">
                We train, equip, and send chaplains to meet real needs in real communities.
                Your partnership helps us make a lasting impact.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link href="/about" className="btn-primary">
                  Learn More
                </Link>
                <Link href="/support" className="btn-accent">
                  Support Us
                </Link>
              </div>
            </div>
            <div className="relative h-80 md:h-96 rounded-xl overflow-hidden shadow-xl">
              <Image
                src="/images/mission-image.jpg"
                alt="IIPEC Mission"
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* Vision Section */}
      <section className="section-padding">
        <div className="container-custom text-center">
          <h2 className="section-title">Serving with Purpose, Leading with Love</h2>
          <p className="section-subtitle mb-12">
            "The best way to find yourself is to lose yourself in the service of others."
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: 'Training', desc: 'Equipping chaplains with excellence' },
              { title: 'Compassion', desc: 'Serving with love and empathy' },
              { title: 'Community', desc: 'Building supportive networks' },
              { title: 'Impact', desc: 'Making a difference worldwide' },
            ].map((item) => (
              <div key={item.title} className="card p-6 text-center">
                <h3 className="text-xl font-bold text-primary mb-2">{item.title}</h3>
                <p className="text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <TestimonialCarousel />
      
      {/* CTA Section */}
      <section className="section-padding bg-primary text-white">
        <div className="container-custom text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Join the Movement</h2>
          <p className="text-lg text-secondary max-w-2xl mx-auto mb-8">
            Be part of a growing community of chaplains making a difference.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/register" className="btn-accent">
              Become a Member
            </Link>
            <Link href="/contact" className="bg-white text-primary px-6 py-3 rounded-lg font-semibold hover:bg-secondary transition-all">
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}