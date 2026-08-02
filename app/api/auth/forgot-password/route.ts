import { NextResponse } from 'next/server'
import crypto, { createHash } from 'crypto'
import nodemailer from 'nodemailer'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { createRateLimiter, enforceCsrfProtection, getClientIdentifier } from '@/lib/security'

const forgotPasswordSchema = z.object({
  email: z.string().trim().toLowerCase().email().max(254),
})

const limiter = createRateLimiter(15 * 60 * 1000, 3)

export async function POST(request: Request) {
  try {
    if (!enforceCsrfProtection(request)) {
      return NextResponse.json({ error: 'Invalid request origin.' }, { status: 403 })
    }

    const clientKey = getClientIdentifier(request)
    if (!limiter.allow(clientKey)) {
      return NextResponse.json({ error: 'Too many password reset attempts. Please try again later.' }, { status: 429 })
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

      const smtpHost = process.env.SMTP_HOST?.trim()
      if (smtpHost) {
        const transporter = nodemailer.createTransport({
          host: smtpHost,
          port: Number(process.env.SMTP_PORT || 587),
          secure: process.env.SMTP_SECURE === 'true',
          auth: process.env.SMTP_USER && process.env.SMTP_PASS
            ? {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
              }
            : undefined,
        })

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
