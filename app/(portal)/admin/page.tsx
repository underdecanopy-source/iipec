import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { AdminMemberManager } from './AdminMemberManager'
import { AdminResourceManager } from './AdminResourceManager'

export default async function AdminPage() {
  const session = await getServerSession(authOptions)

  if (session?.user?.role !== 'ADMIN') {
    redirect('/dashboard')
  }

  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

  const [memberCount, activeMemberCount, resourceCount, unreadMessages] = await Promise.all([
    prisma.user.count({ where: { role: 'MEMBER' } }),
    prisma.user.count({
      where: {
        role: 'MEMBER',
        status: 'ACTIVE',
        lastLoginAt: { gte: thirtyDaysAgo },
      },
    }),
    prisma.resource.count(),
    prisma.contactSubmission.count({ where: { isRead: false } }),
  ])

  return (
    <div>
      <h1 className="text-3xl font-bold text-primary mb-2">Admin Area</h1>
      <p className="text-gray-600 mb-8">
        Manage IIPEC member resources and review portal activity.
      </p>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Members</h2>
          <p className="text-3xl font-bold text-primary mt-2">{memberCount}</p>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Monthly Active</h2>
          <p className="text-3xl font-bold text-primary mt-2">{activeMemberCount}</p>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Resources</h2>
          <p className="text-3xl font-bold text-primary mt-2">{resourceCount}</p>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Unread Messages</h2>
          <p className="text-3xl font-bold text-primary mt-2">{unreadMessages}</p>
        </div>
      </div>

      <div className="space-y-6">
        <AdminMemberManager />
        <AdminResourceManager />
      </div>
    </div>
  )
}
