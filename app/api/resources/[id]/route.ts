import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import fs from 'fs/promises'
import path from 'path'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export const runtime = 'nodejs'

function localResourcePath(fileUrl: string) {
  const resourcesDir = path.join(process.cwd(), 'public', 'resources')
  const filename = path.basename(fileUrl)
  const filePath = path.join(resourcesDir, filename)
  const relativePath = path.relative(resourcesDir, filePath)

  if (!fileUrl.startsWith('/resources/') || relativePath.startsWith('..') || path.isAbsolute(relativePath)) {
    return null
  }

  return filePath
}

export async function DELETE(
  _request: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions)

  if (session?.user?.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  try {
    const resource = await prisma.resource.findUnique({
      where: { id: params.id },
      select: { fileUrl: true },
    })

    if (!resource) {
      return NextResponse.json({ error: 'Resource not found' }, { status: 404 })
    }

    await prisma.resource.delete({ where: { id: params.id } })

    const filePath = localResourcePath(resource.fileUrl)
    if (filePath) {
      await fs.unlink(filePath).catch((error: NodeJS.ErrnoException) => {
        if (error.code !== 'ENOENT') {
          throw error
        }
      })
    }

    return NextResponse.json({ message: 'Resource deleted successfully.' })
  } catch (error) {
    console.error('[RESOURCE_DELETE_ERROR]', error)
    return NextResponse.json({ error: 'Failed to delete resource' }, { status: 500 })
  }
}
