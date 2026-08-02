import { prisma } from '@/lib/prisma'

const SETTING_KEY = 'admin_registration_code'

export async function getAdminRegistrationCode() {
  const setting = await prisma.siteSetting.findUnique({
    where: { key: SETTING_KEY },
  })

  return setting?.value?.trim() || process.env.ADMIN_REGISTRATION_CODE?.trim() || ''
}

export async function setAdminRegistrationCode(value: string) {
  const normalized = value.trim()
  const existing = await prisma.siteSetting.findUnique({
    where: { key: SETTING_KEY },
  })

  if (existing) {
    return prisma.siteSetting.update({
      where: { key: SETTING_KEY },
      data: { value: normalized },
    })
  }

  return prisma.siteSetting.create({
    data: { key: SETTING_KEY, value: normalized },
  })
}
