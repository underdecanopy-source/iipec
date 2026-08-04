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
      fileUrl: true, // Select fileUrl instead of fileData
    },
  })

  if (!resource || !resource.fileUrl) {
    return NextResponse.json({ error: 'Resource not found or file URL is missing' }, { status: 404 })
  }

  const filename = resource.fileName || 'resource'
  const shouldDownload = new URL(request.url).searchParams.get('download') === '1'

  // Fetch the file content from the URL
  let fileContent: ArrayBuffer;
  try {
    const response = await fetch(resource.fileUrl);
    if (!response.ok) {
      console.error(`Failed to fetch file from URL: ${resource.fileUrl}, Status: ${response.status}`);
      return NextResponse.json({ error: 'Failed to retrieve file content' }, { status: 500 });
    }
    fileContent = await response.arrayBuffer();
  } catch (error) {
    console.error('Error fetching file from URL:', error);
    return NextResponse.json({ error: 'Error retrieving file content' }, { status: 500 });
  }

  return new NextResponse(fileContent, {
    headers: {
      'Content-Type': resource.fileType || 'application/octet-stream',
      'Content-Length': String(fileContent.byteLength),
      'Content-Disposition': contentDisposition(filename, shouldDownload),
      'Cache-Control': 'private, max-age=0, must-revalidate',
    },
  })
}
