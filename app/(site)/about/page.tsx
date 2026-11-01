import ImpactStats from '@/components/ImpactStats'
import Image from 'next/image'
import type { Metadata } from 'next'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'About IIPEC Potter’s House Command | International Institute of Pastoral Education and Chaplaincy',
  description:
    'Learn about the mission, history, and values of IIPEC. We are dedicated to providing world-class training for compassionate and skilled chaplains in Nigeria and beyond.',
  openGraph: {
    title: 'About IIPEC Potter’s House Command | International Institute of Pastoral Education and Chaplaincy',
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
    'IIPEC raises, trains, and deploys chaplains for effective Christian ministry and humanitarian service.',
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
        <div className="grid md:grid-cols-2 gap-12 items-center mb-14">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-primary mb-4">About IIPEC Potter’s House Command</h1>
            <p className="text-xl text-gray-700">
              Through compassionate care and unwavering faith, we transform lives and make the world a better place to live.
            </p>
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
        <div className="prose lg:prose-lg max-w-none text-gray-700 space-y-6">
          <section>
            <h2 className="text-3xl font-bold text-primary">Who We Are</h2>
            <p>The International Institute of Pastoral Education and Chaplaincy (IIPEC) was registered in Nigeria under the Land (Perpetual Succession) Act of the Federal Republic of Nigeria on the 10th day of March 1989. For over three decades, IIPEC has stood as a credible institution committed to raising, training, and deploying chaplains for effective Christian ministry and humanitarian service.</p>
            <p>IIPEC is a member of the Accrediting Association of Ministerial Education. It is also an accredited member of the Association of Fundamental Institute of Religious Education. IIPEC is a member of the International Fellowship of Christian Counselors and the International Association of Christian Counselors.</p>
          </section>
          <section>
            <h2 className="text-3xl font-bold text-primary">Potter’s House Command</h2>
            <p>The Potter’s House Command is one of the active operational units of IIPEC. Based in Ibadan, Oyo State, with its administrative office located in Ojota, Lagos State, the Command serves as a structured training and deployment centre for chaplains across South-West Nigeria.</p>
            <p>The Command operates in conjunction with the Evangelism Team of Potter’s House Christian Mission, known as the Jesus Rescue Squad, ensuring that both pastoral training and active outreach remain central to its mandate.</p>
          </section>
          <section>
            <h2 className="text-3xl font-bold text-primary">Our Mission</h2>
            <p>To carry out the Marching Order of the Supreme Commandant General of the whole universe:</p>
            <p className="font-medium text-primary">“Go ye into all the world and preach the gospel.”</p>
            <p>We fulfil this mandate through structured chaplaincy training, active community outreach, hospital ministry, and pastoral care to individuals in every sphere of life, regardless of position, status, or background.</p>
          </section>
          <section>
            <h2 className="text-3xl font-bold text-primary">Our Vision</h2>
            <p>To train, equip, and co-ordinate men and women offering International Christian Counselling Ministry to persons across the following areas of need: individual, marital, career, health, and spiritual needs.</p>
            <p>To offer preventive as well as problem-solving pastoral care services — reaching out to persons with a concern for the whole person and not after material reward.</p>
            <p>To work together with other professionals engaged in the health and spiritual care of men, and to see that the environment becomes a better place to live in.</p>
          </section>
          <section>
            <h2 className="text-3xl font-bold text-primary">Our Training Structure</h2>
            <p>Chaplains are trained through a structured, set-based programme leading to a recognised Diploma in Chaplaincy. Each cohort, known as a Set, undergoes rigorous pastoral, spiritual, and practical training before being formally commissioned and deployed.</p>
            <p>Sets are identified sequentially, and upon enrolment, each chaplain is issued a unique Service Registration ID that identifies their command, unit, set, and year of enrolment.</p>
            <p>Our chaplains serve without regard to denomination or social status, driven purely by the call to minister, comfort, and transform lives wherever they are placed.</p>
          </section>
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
