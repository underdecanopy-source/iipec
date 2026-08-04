import { NextResponse } from 'next/server'
import crypto, { createHash } from 'crypto'
import { headers } from 'next/headers'

import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'
import { z } from 'zod'

import { prisma } from '@/lib/prisma'
import { getTransporter } from '@/lib/email'
import { enforceCsrfProtection } from '@/lib/security'
const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(3, '15 m'), // 3 requests per 15 minutes
  analytics: true,
});

const forgotPasswordSchema = z.object({
  email: z.string().trim().toLowerCase().email().max(254),
})

export async function POST(request: Request) {
  try {
    const ip = headers().get('x-forwarded-for') || '127.0.0.1'
    const { success } = await ratelimit.limit(ip)
    if (!success) {
      return NextResponse.json({ error: 'Too many password reset attempts. Please try again later.' }, { status: 429 })
    }

    if (!enforceCsrfProtection(request)) {
      return NextResponse.json({ error: 'Invalid request origin.' }, { status: 403 })
    }

    const parsed = forgotPasswordSchema.safeParse(await request.json())

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Please provide a valid email address.' },
        { status: 400 }
      )
    }

    const { email } = parsed.data
    const user = await prisma.user.findUnique({ where: { email } })

    if (user) {
      const token = crypto.randomBytes(32).toString('hex')
      const expiresAt = new Date(Date.now() + 1000 * 60 * 60)
      const hashedToken = createHash('sha256').update(token).digest('hex')

      await prisma.user.update({
        where: { id: user.id },
        data: {
          resetPasswordToken: hashedToken,
          resetPasswordExpiresAt: expiresAt,
        },
      })

      const origin = request.headers.get('origin') || process.env.NEXTAUTH_URL || 'http://localhost:3000'
      const resetUrl = `${origin.replace(/\/$/, '')}/reset-password?token=${token}`

      const transporter = getTransporter()
      if (transporter) {

        await transporter.sendMail({
          from: process.env.EMAIL_FROM?.trim() || process.env.SMTP_USER?.trim() || 'no-reply@iipecphc.org',
          to: email,
          subject: 'Reset your IIPEC password',
          html: `<p>Hello ${user.name},</p><p>Use the link below to reset your IIPEC portal password.</p><p><a href="${resetUrl}">${resetUrl}</a></p><p>If you did not request this, you can safely ignore this email.</p>`,
        })
      }
    }

    return NextResponse.json(
      { message: 'If an account exists for that address, a password reset link has been sent.' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Forgot password error:', error)
    return NextResponse.json(
      { error: 'Unable to process your request right now.' },
      { status: 500 }
    )
  }
}
