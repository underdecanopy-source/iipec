import { PrismaClient } from '@prisma/client'

// In development, Next.js clears the Node.js cache on every change,
// which would create a new PrismaClient instance each time. This prevents that.
declare global { // eslint-disable-line no-var
  var prisma: PrismaClient | undefined // eslint-disable-line no-var
}

export const prisma =
  global.prisma ||
  new PrismaClient()

if (process.env.NODE_ENV !== 'production') global.prisma = prisma