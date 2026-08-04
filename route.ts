import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const ContactSchema = z.object({
  name: z.string().min(1, 'Name is required.'),
  email: z.string().email('Invalid email address.'),
  subject: z.string().min(1, 'Subject is required.'),
  message: z.string().min(1, 'Message is required.'),
})

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const validation = ContactSchema.safeParse(body)

    if (!validation.success) {
      return NextResponse.json({ error: 'Invalid input.' }, { status: 400 })
    }

    const { name, email, subject, message } = validation.data

    await prisma.contactSubmission.create({
      data: { name, email, subject, message },
    })

    return NextResponse.json({ message: 'Message sent successfully!' })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'An error occurred.' }, { status: 500 })
  }
}
