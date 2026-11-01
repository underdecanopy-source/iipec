import { prisma } from '@/lib/prisma'

export const defaultStatistics = [
  { id: 'years_of_service', value: '37+', label: 'Years of Service' },
  { id: 'chaplains_trained', value: '5,000+', label: 'Chaplains Trained' },
  { id: 'communities_served', value: '1,200+', label: 'Communities Served' },
  { id: 'lives_impacted', value: '1 Million+', label: 'Lives Impacted' },
]

const settingKey = (id: string) => `impact_stat_${id}`

export async function ensureDefaultStatistics() {
  await prisma.$transaction(
    defaultStatistics.map((stat) =>
      prisma.siteSetting.upsert({
        where: { key: settingKey(stat.id) },
        create: {
          key: settingKey(stat.id),
          value: JSON.stringify({ value: stat.value, label: stat.label }),
        },
        update: {},
      }),
    ),
  )
}

export async function getStatistics() {
  await ensureDefaultStatistics()
  const settings = await prisma.siteSetting.findMany({
    where: { key: { in: defaultStatistics.map((stat) => settingKey(stat.id)) } },
  })
  const settingsByKey = new Map(settings.map((setting) => [setting.key, setting.value]))

  return defaultStatistics.map((stat) => {
    const stored = settingsByKey.get(settingKey(stat.id))
    if (stored) {
      try {
        const parsed: unknown = JSON.parse(stored)
        if (
          typeof parsed === 'object' &&
          parsed !== null &&
          'value' in parsed &&
          typeof parsed.value === 'string' &&
          'label' in parsed &&
          typeof parsed.label === 'string'
        ) {
          return { ...stat, value: parsed.value, label: parsed.label }
        }
      } catch {
        console.error(`[STAT_SETTING_PARSE_ERROR] Unable to parse statistic "${stat.id}".`)
        throw new Error(`Unable to load statistic "${stat.id}" from site settings.`)
      }
      console.error(`[STAT_SETTING_PARSE_ERROR] Statistic "${stat.id}" has an invalid stored value.`)
      throw new Error(`Unable to load statistic "${stat.id}" from site settings.`)
    }
    return stat
  })
}
