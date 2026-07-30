import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)
  const user = session?.user
  const isAdmin = user?.role === 'ADMIN'

  return (
    <div>
      <h1 className="text-3xl font-bold text-primary mb-2">Welcome back, {user?.name}!</h1>
      <p className="text-gray-600 mb-8">
        {isAdmin
          ? 'You have administrative access to the member resource hub.'
          : "Here's an overview of your IIPEC account."}
      </p>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-primary">Account Access</h3>
          <p className="text-gray-600">{isAdmin ? 'Administrator' : 'Member'}</p>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-primary">Quick Links</h3>
          <ul className="space-y-2 text-gray-600">
            <li><a href="/profile" className="text-accent hover:underline">Edit Profile</a></li>
            <li><a href="/member-resources" className="text-accent hover:underline">Member Resources</a></li>
          </ul>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-primary">Support</h3>
          <p className="text-gray-600">Need help? <a href="/contact" className="text-accent hover:underline">Contact us</a></p>
        </div>
      </div>
    </div>
  )
}
