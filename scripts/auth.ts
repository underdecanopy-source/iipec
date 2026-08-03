'use server'

import { headers } from 'next/headers'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

const loginAttempts = new Map<string, number>()
const ResetPasswordSchema = z.object({
  token: z.string().min(1, 'Invalid token.'),
  password: z.string().min(8, 'Password must be at least 8 characters long.'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'], // path of error
});

export async function resetPassword(prevState: any, formData: FormData) {
  const ip = headers().get('x-forwarded-for') || '127.0.0.1'
  const attempts = loginAttempts.get(ip) ?? 0

  if (attempts >= 5) {
    return { error: 'Too many attempts. Please try again later.' }
  }

  loginAttempts.set(ip, attempts + 1)
  // Expire the rate limit attempt after 1 minute
  setTimeout(() => {
    const currentAttempts = loginAttempts.get(ip)
    if (currentAttempts) {
      loginAttempts.set(ip, currentAttempts - 1)
    }
  }, 60 * 1000)
  // Add a check for confirmPassword on the server-side
  const validatedFields = ResetPasswordSchema.safeParse(
    Object.fromEntries(formData.entries())
  )

  if (!validatedFields.success) {
    const fieldErrors = validatedFields.error.flatten().fieldErrors;
    return {
      error:
        fieldErrors.password?.[0] ??
        fieldErrors.confirmPassword?.[0] ??
        'Invalid data provided.',
    };
  }

  const { token, password } = validatedFields.data

  try {
    const user = await prisma.user.findFirst({
      where: {
        resetPasswordToken: token,
        resetPasswordExpiresAt: { gt: new Date() },
      },
    })

    if (!user) {
      return { error: 'Invalid or expired password reset token.' }
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        resetPasswordToken: null,
        resetPasswordExpiresAt: null,
      },
    })

    return { message: 'Your password has been successfully updated.' }
  } catch (error) {
    return { error: 'An unexpected error occurred. Please try again.' }
  }
}