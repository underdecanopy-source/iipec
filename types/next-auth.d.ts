import type { DefaultSession } from 'next-auth'
import type { DefaultJWT } from 'next-auth/jwt'

declare module 'next-auth' {
  interface Session {
    user?: DefaultSession['user'] & {
      id?: string
      role?: string
      phone?: string | null
      address?: string | null
    }
  }

  interface User {
    id?: string
    role?: string
    phone?: string | null
    address?: string | null
  }
}

declare module 'next-auth/jwt' {
  interface JWT extends DefaultJWT {
    id?: string
    role?: string
    phone?: string | null
    address?: string | null
  }
}
