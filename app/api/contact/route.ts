import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { z } from 'zod'
import nodemailer from 'nodemailer'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

const contactSchema = z.object({
  name: z.string().trim().min(2).max(100),
  email: z.string().trim().email().max(255),
  subject: z.string().trim().min(2).max(150),
  message: z.string().trim().min(10).max(5000),
})

const getTransporter = () => {
  const host = process.env.SMTP_HOST?.trim()
  const port = process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : undefined
  const user = process.env.SMTP_USER?.trim()
  const pass = process.env.SMTP_PASSWORD?.trim()

  if (!host || !port || !user || !pass) {
    return null
  }

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
  })
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const parsed = contactSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Please complete the form with valid details.' },
        { status: 400 }
      )
    }

    const session = await getServerSession(authOptions)
    const user = session?.user?.email
      ? await prisma.user.findUnique({
          where: { email: session.user.email },
          select: { id: true },
        })
      : null

    const submission = await prisma.contactSubmission.create({
      data: {
        ...parsed.data,
        userId: user?.id,
      },
      select: { id: true },
    })

    const transporter = getTransporter()
    const contactEmail = process.env.CONTACT_EMAIL?.trim() || 'info@iipecphc.org'
    const mailFrom = process.env.EMAIL_FROM?.trim() || process.env.SMTP_USER?.trim() || `no-reply@${process.env.NEXTAUTH_URL?.replace(/^https?:\/\//, '')}`

    if (transporter) {
      try {
        await transporter.verify()
        await transporter.sendMail({
          from: mailFrom,
          to: contactEmail,
          subject: `IIPEC Contact Form: ${parsed.data.subject}`,
          text: `You have received a new message from the IIPEC contact form.\n\nName: ${parsed.data.name}\nEmail: ${parsed.data.email}\nSubject: ${parsed.data.subject}\n\nMessage:\n${parsed.data.message}`,
          html: `
            <p>You have received a new message from the IIPEC contact form.</p>
            <p><strong>Name:</strong> ${parsed.data.name}</p>
            <p><strong>Email:</strong> ${parsed.data.email}</p>
            <p><strong>Subject:</strong> ${parsed.data.subject}</p>
            <p><strong>Message:</strong></p>
            <p>${parsed.data.message.replace(/\n/g, '<br/>')}</p>
          `,
          replyTo: parsed.data.email,
        })
      } catch (mailError) {
        console.error('[CONTACT_EMAIL_ERROR]', mailError)
        return NextResponse.json(
          { error: 'Unable to deliver your message at this time. Please try again later.' },
          { status: 500 }
        )
      }
    } else {
      console.warn('[CONTACT_EMAIL_WARNING] SMTP is not configured; contact form submissions are being saved without email delivery.')
    }

    return NextResponse.json(
      { message: 'Message received successfully.', id: submission.id },
      { status: 201 }
    )
  } catch (error) {
    console.error('[CONTACT_SUBMISSION_ERROR]', error)
    return NextResponse.json(
      { error: 'Failed to send message. Please try again.' },
      { status: 500 }
    )
  }
}
