export default function ProgramsPage() {
  const programs = [
    {
      title: 'Chaplain Training Program',
      description: 'Comprehensive training for aspiring chaplains covering pastoral care, counseling, and spiritual guidance.',
      duration: '6 months',
      format: 'Hybrid (Online & In-person)',
    },
    {
      title: 'Prison Chaplaincy',
      description: 'Specialized training for chaplains serving in correctional facilities, focusing on rehabilitation and spiritual support.',
      duration: '4 months',
      format: 'In-person',
    },
    {
      title: 'Evangelical Outreach',
      description: 'Training in evangelism and community outreach to share hope and compassion with those in need.',
      duration: '3 months',
      format: 'Online',
    },
    {
      title: 'Pastoral Counseling',
      description: 'Advanced counseling skills for chaplains providing emotional and spiritual support.',
      duration: '6 months',
      format: 'Hybrid',
    },
  ]

  return (
    <div className="section-padding">
      <div className="container-custom">
        <h1 className="text-4xl md:text-5xl font-bold text-primary mb-4">Our Programs</h1>
        <p className="text-xl text-gray-600 max-w-2xl mb-12">
          Equipping chaplains to serve with excellence and compassion through comprehensive training programs.
        </p>

        <div className="grid md:grid-cols-2 gap-8">
          {programs.map((program) => (
            <div key={program.title} className="card p-6">
              <h3 className="text-xl font-bold text-primary mb-2">{program.title}</h3>
              <p className="text-gray-600 mb-4">{program.description}</p>
              <div className="flex flex-wrap gap-4 text-sm">
                <span className="bg-secondary px-3 py-1 rounded-full">📅 {program.duration}</span>
                <span className="bg-secondary px-3 py-1 rounded-full">📚 {program.format}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}