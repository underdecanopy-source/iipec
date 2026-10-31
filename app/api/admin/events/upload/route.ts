import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { put } from '@vercel/blob'

import { authOptions } from '@/lib/auth'

export const runtime = 'nodejs'

const MAX_IMAGE_BYTES = 10 * 1024 * 1024

function safeFileName(fileName: string) {
  return fileName.replace(/[^a-zA-Z0-9._-]/g, '_') || 'event-image'
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions)
  if (session?.user?.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  try {
    const formData = await request.formData()
    const file = formData.get('file')
    if (!(file instanceof File) || !file.type.startsWith('image/')) {
      return NextResponse.json({ error: 'Upload an image file.' }, { status: 400 })
    }
    if (file.size > MAX_IMAGE_BYTES) {
      return NextResponse.json({ error: 'Images must be 10 MB or smaller.' }, { status: 413 })
    }

    const blob = await put(`event-images/${Date.now()}-${safeFileName(file.name)}`, file, { access: 'public' })
    return NextResponse.json({ url: blob.url }, { status: 201 })
  } catch (error) {
    console.error('[EVENT_IMAGE_UPLOAD_ERROR]', error)
    return NextResponse.json({ error: 'Unable to upload event image.' }, { status: 500 })
  }
}
