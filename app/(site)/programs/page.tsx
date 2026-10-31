import { getProgrammes } from '@/lib/programmes'

export const dynamic = 'force-dynamic'

export default async function ProgrammesPage() {
  const programmes = await getProgrammes()

  return (
    <div className="section-padding">
      <div className="container-custom">
        <h1 className="text-4xl md:text-5xl font-bold text-primary mb-4">Our Programmes</h1>
        <p className="text-xl text-gray-600 max-w-2xl mb-12">
          Equipping chaplains to serve with excellence and compassion through comprehensive training programmes.
        </p>

        <div className="grid md:grid-cols-2 gap-8">
          {programmes.map((programme) => (
            <div key={programme.id} className="card p-6">
              <h2 className="text-xl font-bold text-primary mb-2">{programme.title}</h2>
              <p className="text-gray-600 mb-4">{programme.description}</p>
              <div className="flex flex-wrap gap-4 text-sm">
                <span className="bg-secondary px-3 py-1 rounded-full">📅 {programme.duration}</span>
                <span className="bg-secondary px-3 py-1 rounded-full">📚 {programme.delivery}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
