'use client';

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

export default function ImpactStats() {
  const stats = [
    { value: 50, label: 'Trained Chaplains' },
    { value: 10, label: 'Communities Served' },
    { value: 8, label: 'Leadership Team' },
    { value: 4, label: 'Training Programs' },
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
