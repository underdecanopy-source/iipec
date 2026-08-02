import { NextResponse } from 'next/server'
import crypto from 'crypto'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { setAdminRegistrationCode } from '@/lib/adminRegistration'

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'You must be signed in as an admin to reset the registration code.' },
        { status: 403 }
      )
    }

    const body = await request.json().catch(() => ({}))
    const incomingCode = typeof body?.newCode === 'string' ? body.newCode.trim() : ''
    const newCode = incomingCode || crypto.randomBytes(6).toString('hex').toUpperCase()

    await setAdminRegistrationCode(newCode)
    await prisma.auditLog.create({
      data: {
        userId: session.user.id,
        action: 'ADMIN_REGISTRATION_CODE_RESET',
        details: 'Reset the admin registration code',
      },
    })

    return NextResponse.json(
      { message: 'Admin registration code reset successfully.', code: newCode },
      { status: 200 }
    )
  } catch (error) {
    console.error('Admin registration code reset error:', error)
    return NextResponse.json(
      { error: 'Unable to reset the admin registration code right now.' },
      { status: 500 }
    )
  }
}
