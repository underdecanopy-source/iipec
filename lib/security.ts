const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000
const RATE_LIMIT_MAX_REQUESTS = 5

const rateLimitStore = new Map<string, { count: number; resetAt: number }>()

export function getClientIdentifier(request: Request) {
  const forwardedFor = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
  const realIp = request.headers.get('x-real-ip')?.trim()
  const ip = forwardedFor || realIp || 'unknown'
  return ip
}

export function createRateLimiter(windowMs = RATE_LIMIT_WINDOW_MS, maxRequests = RATE_LIMIT_MAX_REQUESTS) {
  return {
    allow(key: string) {
      const now = Date.now()
      const existing = rateLimitStore.get(key)

      if (!existing || existing.resetAt <= now) {
        rateLimitStore.set(key, { count: 1, resetAt: now + windowMs })
        return true
      }

      if (existing.count >= maxRequests) {
        return false
      }

      existing.count += 1
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
