import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
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
    select: {
      fileName: true,
      fileType: true,
      fileData: true,
    },
  })

  if (!resource || !resource.fileData) {
    return NextResponse.json({ error: 'Resource file not found' }, { status: 404 })
  }

  const filename = resource.fileName || 'resource'
  const shouldDownload = new URL(request.url).searchParams.get('download') === '1'
  const file = new Uint8Array(resource.fileData)

  return new NextResponse(file, {
    headers: {
      'Content-Type': resource.fileType || 'application/octet-stream',
      'Content-Length': String(file.byteLength),
      'Content-Disposition': contentDisposition(filename, shouldDownload),
      'Cache-Control': 'private, max-age=0, must-revalidate',
    },
  })
}
