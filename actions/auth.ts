'use server'

import { headers } from 'next/headers'
import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  // Allow 5 requests from the same IP in a 1-minute window
  limiter: Ratelimit.slidingWindow(5, '1 m'),
  analytics: true,
});

const ResetPasswordSchema = z.object({
  token: z.string().min(1, 'Invalid token.'),
  password: z.string().min(8, 'Password must be at least 8 characters long.'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'], // path of error
});

// Define a type for the form state
type FormState = {
  error?: string;
  message?: string;
};

export async function resetPassword(prevState: any, formData: FormData) {
  const ip = headers().get('x-forwarded-for') || '127.0.0.1'
  const { success } = await ratelimit.limit(ip)

  if (!success) {
    return { error: 'Too many attempts. Please try again later.' }
  }

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
    } as FormState;
  }

  const { token, password } = validatedFields.data

  try {
    const user = await prisma.user.findFirst({ // Changed to findFirst as query is not on a unique field
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

    return { message: 'Your password has been successfully updated.' } as FormState;
  } catch (error) {
    return { error: 'An unexpected error occurred. Please try again.' } as FormState;
  }
}