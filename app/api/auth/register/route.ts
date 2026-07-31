import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'

const registerSchema = z.object({
  name: z.string().trim().min(2).max(100),
  email: z.string().trim().toLowerCase().email().max(254),
  phone: z.string().trim().min(5).max(30).optional(),
  password: z.string().min(8).max(128),
  adminCode: z.string().trim().optional(),
})

export async function POST(request: Request) {
  try {
    const parsed = registerSchema.safeParse(await request.json())

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Please provide a valid name, email, phone number, and password of at least 8 characters' },
        { status: 400 }
      )
    }

    const { name, email, phone, password, adminCode } = parsed.data

    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      return NextResponse.json(
        { error: 'User already exists' },
        { status: 400 }
      )
    }

    const configuredAdminCode = process.env.ADMIN_REGISTRATION_CODE?.trim()
    const role = adminCode && configuredAdminCode && adminCode === configuredAdminCode ? 'ADMIN' : 'MEMBER'

    if (adminCode && role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Invalid admin registration code' },
        { status: 403 }
      )
    }

    const hashedPassword = await bcrypt.hash(password, 10)
    const user = await prisma.user.create({
      data: {
        name,
        email,
        phone,
        password: hashedPassword,
        role,
      },
    })

    return NextResponse.json(
      { message: 'User created successfully', userId: user.id },
      { status: 201 }
    )
  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
