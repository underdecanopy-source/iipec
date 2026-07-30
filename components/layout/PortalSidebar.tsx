'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut, useSession } from 'next-auth/react'

export function PortalSidebar() {
  const pathname = usePathname()
  const { data: session } = useSession()
  const isAdmin = session?.user?.role === 'ADMIN'

  const links = [
    { href: '/dashboard', label: 'Dashboard', icon: 'DB' },
    { href: '/profile', label: 'My Profile', icon: 'ME' },
    { href: '/member-resources', label: 'Resources', icon: 'FILE' },
    ...(isAdmin ? [{ href: '/admin', label: 'Admin', icon: 'ADM' }] : []),
  ]

  return (
    <aside className="fixed left-0 top-0 h-full w-64 bg-white shadow-lg hidden md:block">
      <div className="p-6">
        <h2 className="text-xl font-bold text-primary">Member Portal</h2>
      </div>
      <nav className="px-4">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg mb-1 transition-colors ${
              pathname === link.href
                ? 'bg-primary text-white'
                : 'text-gray-600 hover:bg-secondary hover:text-primary'
            }`}
          >
            <span className="w-10 text-xs font-semibold uppercase tracking-wide opacity-70">{link.icon}</span>
            {link.label}
          </Link>
        ))}
        <button
          onClick={() => signOut()}
          className="flex items-center gap-3 px-4 py-3 rounded-lg w-full text-left text-gray-600 hover:bg-red-50 hover:text-red-600 transition-colors mt-4"
        >
          <span className="w-10 text-xs font-semibold uppercase tracking-wide opacity-70">OUT</span>
          Logout
        </button>
      </nav>
    </aside>
  )
}
