import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import fs from 'fs/promises'
import path from 'path'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export const runtime = 'nodejs'

function contentDisposition(filename: string, download: boolean) {
  const fallbackName = filename.replace(/["\\]/g, '_')
  const encodedName = encodeURIComponent(filename)
  const disposition = download ? 'attachment' : 'inline'

  return `${disposition}; filename="${fallbackName}"; filename*=UTF-8''${encodedName}`
}

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const resource = await prisma.resource.findUnique({
    where: { id: params.id },
  })

  if (!resource) {
    return NextResponse.json({ error: 'Resource not found' }, { status: 404 })
  }

  const filename = path.basename(resource.fileUrl)
  const resourcesDir = path.join(process.cwd(), 'public', 'resources')
  const filePath = path.join(resourcesDir, filename)
  const relativePath = path.relative(resourcesDir, filePath)

  if (relativePath.startsWith('..') || path.isAbsolute(relativePath)) {
    return NextResponse.json({ error: 'Invalid file path' }, { status: 400 })
  }

  try {
    const file = await fs.readFile(filePath)
    const shouldDownload = new URL(request.url).searchParams.get('download') === '1'

    return new NextResponse(file, {
      headers: {
        'Content-Type': resource.fileType || 'application/octet-stream',
        'Content-Length': String(file.byteLength),
        'Content-Disposition': contentDisposition(filename, shouldDownload),
        'Cache-Control': 'private, max-age=0, must-revalidate',
      },
    })
  } catch {
    return NextResponse.json({ error: 'File is missing from storage' }, { status: 404 })
  }
}
