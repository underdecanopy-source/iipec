import { prisma } from '@/lib/prisma'

const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000
const RATE_LIMIT_MAX_REQUESTS = 5

export function getClientIdentifier(request: Request) {
  const headers = request.headers
  // Use the Vercel-provided IP header if available
  const forwardedFor = headers.get('x-forwarded-for')?.split(',')[0]?.trim()
  const realIp = headers.get('x-real-ip')?.trim()
  const ip = forwardedFor || realIp || 'unknown'
  return ip
}

export function createRateLimiter(windowMs = RATE_LIMIT_WINDOW_MS, maxRequests = RATE_LIMIT_MAX_REQUESTS) {
  return {
    async allow(key: string) {
      const now = Date.now()
      const windowStart = now - windowMs

      // Clean up old attempts and count recent ones in a single transaction
      const [_, attempts] = await prisma.$transaction([
        prisma.rateLimitAttempt.deleteMany({
          where: {
            key: key,
            timestamp: { lt: new Date(windowStart) },
          },
        }),
        prisma.rateLimitAttempt.findMany({
          where: {
            key: key,
            timestamp: { gte: new Date(windowStart) },
          },
        }),
      ])

      if (attempts.length >= maxRequests) {
        return false
      }

      // Record the new attempt
      await prisma.rateLimitAttempt.create({
        data: { key, timestamp: new Date(now) },
      })

        return true
    },
  }
}

export function enforceCsrfProtection(request: Request) {
  if (!['POST', 'PATCH', 'PUT', 'DELETE'].includes(request.method)) {
    return true
  }

  const origin = request.headers.get('origin')
  const referer = request.headers.get('referer')
  const host = request.headers.get('host') || request.headers.get('x-forwarded-host') || ''

  if (origin) {
    try {
      const originUrl = new URL(origin)
      return originUrl.host === host
    } catch {
      return false
    }
  }

  if (!referer || !host) {
    return false
  }

  try {
    const refererUrl = new URL(referer)
    return refererUrl.host === host
  } catch {
    return false
  }
}

export function escapeHtml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}
