import type { NextAuthOptions } from 'next-auth'
import { CredentialsSignin } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'

const authSecret = process.env.NEXTAUTH_SECRET?.trim()

if (!authSecret) {
  throw new Error('Missing NEXTAUTH_SECRET environment variable')
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        const email = credentials?.email?.trim().toLowerCase()
        const password = credentials?.password

        if (!email || !password) {
          throw new CredentialsSignin('Please provide email and password.')
        }

        const user = await prisma.user.findUnique({
          where: { email },
        })

        if (!user || !user.password) {
          throw new CredentialsSignin('Invalid credentials.')
        }

        const isValid = await bcrypt.compare(password, user.password)

        if (!isValid) {
          throw new CredentialsSignin('Invalid credentials.')
        }

        if (user.status === 'SUSPENDED') {
          throw new CredentialsSignin('Your account is suspended.')
        }
        if (user.status === 'DISABLED') {
          throw new CredentialsSignin('Your account has been disabled.')
        }

        await prisma.user.update({
          where: { id: user.id },
          data: { lastLoginAt: new Date() },
        })

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          phone: user.phone,
          profileImage: user.profileImage,
          address: user.address,
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id
        token.role = user.role
        token.phone = user.phone
        token.picture = user.profileImage
        token.address = user.address
      }

      if (trigger === 'update' && session?.user) {
        // Update the token with new session data
        token.name = session.user.name
        token.phone = session.user.phone
        token.address = session.user.address
        token.picture = session.user.image
      }

      return token
    },
    async session({ session, token }) {
      // The token now has all the data, assign it to the session
      if (token && session.user) {
        session.user.id = token.id
        session.user.role = token.role
        session.user.phone = token.phone
        session.user.image = token.picture
        session.user.address = token.address
      }

      return session
    },
  },
  session: {
    strategy: 'jwt',
  },
  cookies: {
    sessionToken: {
      name: `${process.env.NODE_ENV === 'production' ? '__Secure-' : ''}next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production',
      },
    },
  },
  pages: {
    signIn: '/login',
  },
  secret: authSecret,
}
