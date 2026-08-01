import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export default async function AdminAuditPage() {
  const session = await getServerSession(authOptions)
  if (session?.user?.role !== 'ADMIN') {
    redirect('/dashboard')
  }

  const auditLogs = await prisma.auditLog.findMany({
    orderBy: { createdAt: 'desc' },
    take: 100,
    select: {
      id: true,
      action: true,
      details: true,
      createdAt: true,
      user: {
        select: {
          name: true,
          email: true,
        },
      },
    },
  })

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-10">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-primary">Audit Logs</h1>
          <p className="text-gray-600 mt-2">Review recent admin actions and message state changes.</p>
        </div>
        <Link
          href="/admin"
          className="inline-flex rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50 transition-colors"
        >
          Back to admin dashboard
        </Link>
      </div>

      <div className="space-y-4">
        {auditLogs.length === 0 ? (
          <div className="rounded-xl border border-dashed border-gray-200 bg-white p-6 text-gray-600">
            No audit log entries found.
          </div>
        ) : (
          auditLogs.map((log) => (
            <div key={log.id} className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm uppercase tracking-wide text-slate-500">{log.action}</p>
                  <p className="mt-1 text-sm text-slate-500">
                    {log.user?.name || log.user?.email || 'System'}
                  </p>
                </div>
                <p className="text-sm text-slate-500">
                  {new Date(log.createdAt).toLocaleString()}
                </p>
              </div>
              {log.details && (
                <p className="mt-4 whitespace-pre-wrap text-gray-700">{log.details}</p>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  )
}
