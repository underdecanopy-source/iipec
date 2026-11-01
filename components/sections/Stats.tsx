import { getStatistics } from '@/lib/statistics'

export async function Stats() {
  const stats = await getStatistics()

  return (
    <section className="section-padding bg-gray-100">
      <div className="container-custom">
        <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl text-center mb-12">
          Our Impact by the Numbers
        </h2>
        <div className="grid grid-cols-2 gap-6 text-center lg:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.id} className="bg-white rounded-xl p-6 shadow-sm flex flex-col gap-y-4">
              <p className="text-base leading-7 text-gray-600">{stat.label}</p>
              <p className="order-first text-5xl font-semibold tracking-tight text-primary">{stat.value}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}