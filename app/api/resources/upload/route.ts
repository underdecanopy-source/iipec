import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import fs from 'fs/promises'
import path from 'path'

export const runtime = 'nodejs'

export async function POST(request: Request) {
  const session = await getServerSession(authOptions)
  if (session?.user?.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  try {
    const formData = await request.formData()
    const file = formData.get('file') as any
    if (!file || typeof file.arrayBuffer !== 'function') {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    const title = (formData.get('title') as string) || file.name || 'resource'
    const description = (formData.get('description') as string) || ''

    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    const resourcesDir = path.join(process.cwd(), 'public', 'resources')
    await fs.mkdir(resourcesDir, { recursive: true })

    const safeName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, '_')}`
    const filePath = path.join(resourcesDir, safeName)
    await fs.writeFile(filePath, buffer)

    const fileUrl = `/resources/${safeName}`
    const sizeMb = (buffer.byteLength / (1024 * 1024)).toFixed(2) + ' MB'
    const fileType = file.type || (safeName.split('.').pop() || '').toUpperCase()

    const resource = await prisma.resource.create({
      data: {
        title,
        description,
        fileUrl,
        fileType,
        size: sizeMb,
        isMemberOnly: true,
      },
    })

    return NextResponse.json(resource, { status: 201 })
  } catch (err) {
    console.error('Upload error:', err)
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 })
  }
}
