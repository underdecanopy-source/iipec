import { randomUUID } from 'crypto'
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export const runtime = 'nodejs'

const MAX_UPLOAD_BYTES = 10 * 1024 * 1024

function sanitizeFileName(fileName: string) {
  return fileName.replace(/[^a-zA-Z0-9._-]/g, '_')
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions)
  if (session?.user?.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  try {
    const formData = await request.formData()
    const file = formData.get('file') as File | null
    if (!file || typeof file.arrayBuffer !== 'function') {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    if (file.size > MAX_UPLOAD_BYTES) {
      return NextResponse.json({ error: 'File is too large. Upload files up to 10 MB.' }, { status: 413 })
    }

    const fileName = sanitizeFileName(file.name || 'resource')
    const title = ((formData.get('title') as string) || file.name || 'resource').trim()
    const description = ((formData.get('description') as string) || '').trim()
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)
    const resourceId = randomUUID()

    const resource = await prisma.resource.create({
      data: {
        id: resourceId,
        title,
        description,
        fileUrl: `/api/resources/${resourceId}/download`,
        fileName,
        fileType: file.type || 'application/octet-stream',
        fileData: buffer,
        size: (buffer.byteLength / (1024 * 1024)).toFixed(2) + ' MB',
        isMemberOnly: true,
      },
      select: {
        id: true,
        title: true,
        description: true,
        fileUrl: true,
        fileName: true,
        fileType: true,
        size: true,
        isMemberOnly: true,
        createdAt: true,
      },
    })

    return NextResponse.json(resource, { status: 201 })
  } catch (err) {
    console.error('Upload error:', err)
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 })
  }
}
