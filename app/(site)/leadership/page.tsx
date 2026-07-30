import Image from 'next/image'

export default function LeadershipPage() {
  const leaders = [
    {
      name: 'Sir Herman Keck',
      role: 'Chief of Chaplain Worldwide',
      description: 'Providing global leadership and vision for chaplaincy ministry worldwide.',
      image: '/images/Sir Herman Keck.jpg',
    },
    {
      name: 'Sir Ige Olumide',
      role: 'Chief of Chaplain African Command Headquarters',
      description: 'Leading chaplaincy operations across Africa with excellence and compassion.',
      image: '/images/Sir. Ige Olumide.jpg',
    },
    {
      name: 'Chap. Dr. E.O. Ige Olumide',
      role: 'Chief of Chaplain',
      description: 'Dedicated to equipping chaplains for effective ministry.',
      image: '/images/Chap. Dr. E. O. Ige Olumide.jpg',
    },
    {
      name: 'Chap. Dr. Isaac Okpuzor',
      role: 'Deputy Chief of Chaplain, Zonal Commandant',
      description: 'Overseeing zonal operations and chaplain training programs.',
      image: '/images/Chap. Dr. Isaac Okpuzor.jpg',
    },
    {
      name: 'Chap. Dr. Rebecca Okpuzor',
      role: 'Deputy Chief of Chaplain, Zonal Parade Commandant',
      description: 'Leading with compassion and excellence in chaplaincy services.',
      image: '/images/Chap. Dr. Rebecca Okpuzor.jpg',
    },
    {
      name: 'Chap. Dr. Isaac Apata',
      role: 'Deputy Chief of Chaplain, Potter\'s House Commander',
      description: 'Commanding chaplaincy operations at Potter\'s House.',
      image: '/images/Chap. Dr. Isaac Apata.jpg',
    },
    {
      name: 'Chap. Segun Ariyo',
      role: 'Patron, Potter\'s House Command',
      description: 'Providing patronage and support for chaplaincy ministries.',
      image: '/images/Chap. Segun Ariyo.jpg',
    },
    {
      name: 'Chap. Oladipupo Abidoye',
      role: 'Adjutant, Potter\'s House Command',
      description: 'Supporting chaplaincy operations and administrative functions.',
      image: '/images/Chap. Oladipupo Abidoye.jpg',
    },
  ]

  return (
    <div className="section-padding">
      <div className="container-custom">
        <h1 className="text-4xl md:text-5xl font-bold text-primary mb-4">Our Leadership</h1>
        <p className="text-xl text-gray-600 max-w-2xl mb-12">
          Meet the dedicated leaders guiding IIPEC Potter's House Command with purpose and love.
        </p>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {leaders.map((leader) => (
            <div key={leader.name} className="card p-6 text-center">
              <div className="relative w-48 h-48 mx-auto mb-4 rounded-full overflow-hidden border-4 border-primary/10 bg-primary/10">
                <Image
                  src={leader.image}
                  alt={leader.name}
                  fill
                  className="object-cover"
                />
              </div>
              <h3 className="text-lg font-bold text-primary">{leader.name}</h3>
              <p className="text-accent font-medium text-sm mb-2">{leader.role}</p>
              <p className="text-gray-600 text-sm">{leader.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}