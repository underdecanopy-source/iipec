import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import { AdminMemberManager } from '../AdminMemberManager'

export default async function AdminMemberManagementPage() {
  const session = await getServerSession(authOptions)

  if (session?.user?.role !== 'ADMIN') {
    redirect('/dashboard')
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-primary mb-2">Member Management</h1>
      <p className="text-gray-600 mb-8">
        View, print, export, suspend, disable, or delete member accounts from a dedicated admin page.
      </p>
      <AdminMemberManager />
    </div>
  )
}
