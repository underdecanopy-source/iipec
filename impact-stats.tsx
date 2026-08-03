import { prisma } from '@/lib/prisma'

interface StatItemProps {
  value: number;
  label: string;
}

function StatItem({ value, label }: StatItemProps) {
  return (
    <div className="text-center">
      <p className="text-4xl font-bold text-primary md:text-5xl">
        {value}+
      </p>
      <p className="mt-2 text-lg text-gray-600">{label}</p>
    </div>
  );
}

export default async function ImpactStats() {
  const statKeys = [
    'stats_trained_chaplains',
    'stats_communities_served',
    'stats_leadership_team',
    'stats_training_programs',
  ];

  const settings = await prisma.siteSetting.findMany({
    where: { key: { in: statKeys } },
  });

  const statsMap = new Map(settings.map(s => [s.key, parseInt(s.value, 10)]));

  const stats = [
    { value: statsMap.get('stats_trained_chaplains') || 50, label: 'Trained Chaplains' },
    { value: statsMap.get('stats_communities_served') || 10, label: 'Communities Served' },
    { value: statsMap.get('stats_leadership_team') || 8, label: 'Leadership Team' },
    { value: statsMap.get('stats_training_programs') || 4, label: 'Training Programs' },
  ];

  return (
    <div className="bg-gray-50 py-12 sm:py-16">
      <div className="container-custom">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {stats.map((stat) => (
            <StatItem key={stat.label} value={stat.value} label={stat.label} />
          ))}
        </div>
      </div>
    </div>
  );
}
