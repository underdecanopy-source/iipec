import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { z } from 'zod'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

const contactSchema = z.object({
  name: z.string().trim().min(2).max(100),
  email: z.string().trim().email().max(255),
  subject: z.string().trim().min(2).max(150),
  message: z.string().trim().min(10).max(5000),
})

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
