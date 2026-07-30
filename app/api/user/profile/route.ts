import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { z } from 'zod'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

const profileSchema = z.object({
  name: z.string().trim().min(2, 'Name must be at least 2 characters').max(100),
  phone: z.string().max(20).optional().nullable(),
  address: z.string().max(255).optional().nullable(),
})

export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const parsed = profileSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Please provide valid profile details' },
        { status: 400 }
      )
    }

    const { name, phone, address } = parsed.data

    const updatedUser = await prisma.user.update({
      where: { email: session.user.email },
      data: { name, phone, address },
      select: {
        // The session callback in NextAuth will determine what's in the session,
        // but we can return the updated fields to the client for immediate UI update.
        name: true,
        phone: true,
        address: true,
      },
    })

    return NextResponse.json({
      message: 'Profile updated successfully',
      user: updatedUser,
    })
  } catch (error) {
    console.error('[PROFILE_UPDATE_ERROR]', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}