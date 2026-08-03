import { UserRole } from '@prisma/client'
import NextAuth, { DefaultSession } from 'next-auth'
import { AdapterUser } from 'next-auth/adapters'
import { JWT } from 'next-auth/jwt'

declare module 'next-auth' {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: {
      id: string
      role: UserRole
      phone?: string | null
      address?: string | null
    } & DefaultSession['user']
  }

  /**
   * The shape of the user object returned in the OAuth providers' `profile` callback,
   * or the `authorize` callback for Credentials provider.
   */
  interface User {
    role: UserRole
    phone?: string | null
    address?: string | null
    profileImage?: string | null
  }
}

declare module 'next-auth/adapters' {
  interface AdapterUser {
    role: UserRole
    phone?: string | null
    address?: string | null
    profileImage?: string | null
  }
}

declare module 'next-auth/jwt' {
  /** Returned by the `jwt` callback and `getToken`, when using JWT sessions */
  interface JWT {
    id: string
    role: UserRole
    phone?: string | null
    address?: string | null
    picture?: string | null
    name?: string | null
  }
}