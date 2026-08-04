import { NextResponse } from 'next/server'
import nodemailer from 'nodemailer'
import { getServerSession } from 'next-auth'
import { headers } from 'next/headers'
import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { enforceCsrfProtection, escapeHtml } from '@/lib/security'

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(5, '10 m'), // 5 requests per 10 minutes for admin replies
  analytics: true,
});

const replySchema = z.object({
  reply: z.string().trim().min(1, 'Reply text is required.'),
});

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

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  if (!enforceCsrfProtection(request)) {
    return NextResponse.json({ error: 'Invalid request origin.' }, { status: 403 })
  }

  const ip = headers().get('x-forwarded-for') || '127.0.0.1'
  const { success } = await ratelimit.limit(ip)
  if (!success) {
    return NextResponse.json({ error: 'Too many admin replies. Please try again later.' }, { status: 429 })
  }

  const session = await getServerSession(authOptions)
  if (session?.user?.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const body = await request.json().catch(() => null)
  const parsed = replySchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: 'Reply text is required.' }, { status: 400 });
  }

  const { reply } = parsed.data;

  if (!reply) {
    return NextResponse.json({ error: 'Reply text is required.' }, { status: 400 })
  }

  const submission = await prisma.contactSubmission.findUnique({
    where: { id: params.id },
    select: {
      email: true,
      name: true,
      subject: true,
      message: true,
    },
  })

  if (!submission) {
    return NextResponse.json({ error: 'Message not found.' }, { status: 404 })
  }

  const transporter = getTransporter()
  if (!transporter) {
    return NextResponse.json(
      { error: 'SMTP is not configured. Admin reply cannot be sent.' },
      { status: 500 }
    )
  }

  const mailFrom = process.env.EMAIL_FROM?.trim() || process.env.SMTP_USER?.trim() || `no-reply@${process.env.NEXTAUTH_URL?.replace(/^https?:\/\//, '')}`

  try {
    await transporter.verify()
    await transporter.sendMail({
      from: mailFrom,
      to: submission.email,
      subject: `Re: ${submission.subject}`,
      text: `Hello ${submission.name},\n\n${reply}\n\n---\nOriginal message:\n${submission.message}`,
      html: `
        <p>Hello ${escapeHtml(submission.name)},</p>
        <p>${escapeHtml(reply).replace(/\n/g, '<br/>')}</p>
        <hr />
        <p><strong>Original message:</strong></p>
        <p>${escapeHtml(submission.message).replace(/\n/g, '<br/>')}</p>
      `,
      replyTo: mailFrom,
    })

    if (!session.user.id) {
      return NextResponse.json({ error: 'Invalid admin session.' }, { status: 403 })
    }

    await prisma.contactReply.create({
      data: {
        contactId: params.id,
        adminId: session.user.id,
        content: reply,
      },
    })

    await prisma.contactSubmission.update({
      where: { id: params.id },
      data: { status: 'REPLIED' },
    })

    await prisma.auditLog.create({
      data: {
        userId: session.user.id,
        action: 'MESSAGE_REPLIED',
        details: `Reply sent for message ${params.id}`,
      },
    })
  } catch (mailError) {
    console.error('[ADMIN_REPLY_EMAIL_ERROR]', mailError)
    return NextResponse.json(
      { error: 'Unable to send reply. Please try again later.' },
      { status: 500 }
    )
  }

  return NextResponse.json({ message: 'Reply sent successfully.' })
}
