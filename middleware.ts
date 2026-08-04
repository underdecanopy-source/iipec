import { withAuth, NextAuthRequest } from 'next-auth/middleware'
import { NextResponse } from 'next/server'
import { enforceCsrfProtection } from './lib/security'

const protectedRoutes = ['/dashboard', '/profile', '/member-resources']
const adminRoutes = ['/admin']

export default withAuth(
  // Use NextAuthRequest for better type safety
  function middleware(request: NextAuthRequest) {
    // `nextauth` is attached at runtime by next-auth middleware; cast to any for type safety
    const token = (request as any).nextauth?.token
    const pathname = request.nextUrl.pathname

    // Enforce CSRF protection on all state-changing requests
    if (!enforceCsrfProtection(request)) {
      return new NextResponse('Invalid request origin', { status: 403 })
    }

    if (adminRoutes.some(route => pathname.startsWith(route))) {
      if (token?.role !== 'ADMIN') {
        return NextResponse.redirect(new URL('/dashboard', request.url))
      }
    }

    if (protectedRoutes.some(route => pathname.startsWith(route))) {
      if (!token) {
        return NextResponse.redirect(new URL('/login', request.url))
      }
    }

    const response = NextResponse.next()
    response.headers.set('X-Frame-Options', 'DENY')
    response.headers.set('X-Content-Type-Options', 'nosniff')
    response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
    response.headers.set('Permissions-Policy', 'geolocation=(), microphone=(), camera=()')
    response.headers.set('X-DNS-Prefetch-Control', 'off')
    response.headers.set('Content-Security-Policy', "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self'; object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'none'")
    if (process.env.NODE_ENV === 'production') {
      response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains')
    }
    return response
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
)

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/profile/:path*',
    '/member-resources/:path*',
    '/admin/:path*',
  ],
}
