import ImpactStats from '@/components/ImpactStats'
import Image from 'next/image'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About IIPEC | International Institute of Pastoral Education and Chaplaincy',
  description:
    'Learn about the mission, history, and values of IIPEC. We are dedicated to providing world-class training for compassionate and skilled chaplains in Nigeria and beyond.',
  openGraph: {
    title: 'About IIPEC | International Institute of Pastoral Education and Chaplaincy',
    description: 'Discover our commitment to shaping compassionate and skilled chaplains.',
    images: ['/images/mission-image.jpg'],
  },
}

const iipexOrgData = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'The International Institute of Pastoral Education and Chaplaincy (IIPEC)',
  url: 'https://www.iipecphc.org',
  logo: 'https://www.iipecphc.org/logo.png',
  foundingDate: '1989-03-10',
  description:
    'IIPEC is a premier institution dedicated to shaping compassionate and skilled chaplains through world-class training grounded in spiritual depth and professional excellence.',
}

function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  )
}

function AboutContent() {
  return (
    <section className="section-padding">
      <div className="container-custom">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-primary mb-4">About IIPEC</h1>
            <div className="prose lg:prose-lg max-w-none text-gray-700 space-y-6">
              <p>
                Welcome to The International Institute of Pastoral Education and Chaplaincy (IIPEC), a premier institution dedicated to shaping compassionate and skilled chaplains. Since our establishment, we have been committed to providing world-class training grounded in spiritual depth and professional excellence.
              </p>
              <p>
                Our mission is to equip individuals for effective service in diverse communities. Through comprehensive programs, we foster leadership, resilience, and a profound commitment to pastoral care. We believe in empowering our chaplains to make a meaningful impact wherever they are called to serve.
              </p>
              <p>
                Founded on March 10, 1989, under the Land (Perpetual Succession) Act of the Federal Republic of Nigeria, IIPEC has a rich history of nurturing service-oriented leaders prepared to meet the challenges of today's world.
              </p>
            </div>
          </div>
          <div className="rounded-xl overflow-hidden shadow-lg">
            <Image
              src="/images/mission-image.jpg"
              alt="A group of IIPEC chaplains in uniform smiling and serving their community"
              width={1200}
              height={800}
              priority
            />
          </div>
        </div>
      </div>
    </section>
  )
}

export default function AboutPage() {
  return (
    <>
      <AboutContent />
      <ImpactStats />
      <JsonLd data={iipexOrgData} />
    </>
  )
}