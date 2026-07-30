import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, email, subject, message } = body

    await prisma.contactSubmission.create({
      data: { name, email, subject, message },
    })

    return NextResponse.json({ message: 'Message sent successfully!' })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'An error occurred.' }, { status: 500 })
  }
}
