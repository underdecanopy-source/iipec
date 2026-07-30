const stats = [
  {
    id: 1,
    name: 'Years of Service',
    value: `${new Date().getFullYear() - 1989}+`,
  },
  { id: 2, name: 'Chaplains Trained', value: '5,000+' },
  { id: 3, name: 'Communities Served', value: '1,200+' },
  { id: 4, name: 'Lives Impacted', value: '1 Million+' },
]

export default function ImpactStats() {
  return (
    <div className="bg-gray-100 dark:bg-gray-800 section-padding">
      <div className="container-custom">
        <div className="mx-auto max-w-2xl lg:max-w-none">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">Our Impact by the Numbers</h2>
            <p className="mt-4 text-lg leading-8 text-gray-600 dark:text-gray-300">
              Since 1989, we have been committed to service and excellence in chaplaincy.
            </p>
          </div>
          <dl className="grid grid-cols-1 gap-y-16 text-center sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.id} className="flex flex-col gap-y-4">
                <dt className="text-base leading-7 text-gray-600 dark:text-gray-400">{stat.name}</dt>
                <dd className="order-first text-5xl font-semibold tracking-tight text-primary">{stat.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </div>
  )
}