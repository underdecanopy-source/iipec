'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut, useSession } from 'next-auth/react'
import { useState } from 'react'

const icons = {
  dashboard: (
    <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9.5L12 3l9 6.5v10.5a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9.5Z" />
      <path d="M9 22V12h6v10" />
    </svg>
  ),
  profile: (
    <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  ),
  resources: (
    <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 7a2 2 0 0 1 2-2h5l2 2h9a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7Z" />
      <path d="M3 7h18" />
    </svg>
  ),
  admin: (
    <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2 4 5v6c0 5.25 3.5 9.74 8 11 4.5-1.26 8-5.75 8-11V5l-8-3Z" />
      <path d="M9.5 12.5 12 15l4.5-4.5" />
      <path d="M12 7v4" />
    </svg>
  ),
  audit: (
    <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14" />
      <path d="M12 5v14" />
      <path d="M14 7l-4 4 4 4" />
    </svg>
  ),
  memberManagement: (
    <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 6h16M4 12h16M4 18h16" />
      <path d="M8 6v12" />
    </svg>
  ),
  logout: (
    <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <path d="M16 17l5-5-5-5" />
      <path d="M21 12H9" />
    </svg>
  ),
}

export function PortalSidebar() {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()
  const { data: session } = useSession()
  const isAdmin = session?.user?.role === 'ADMIN'

  const links = [
    { href: '/dashboard', label: 'Dashboard', icon: icons.dashboard },
    { href: '/profile', label: 'My Profile', icon: icons.profile },
    { href: '/member-resources', label: 'Resources', icon: icons.resources },
    ...(isAdmin
      ? [
          { href: '/admin', label: 'Admin', icon: icons.admin },
          { href: '/admin/messages', label: 'Unread Messages', icon: icons.memberManagement },
          { href: '/admin/audit', label: 'Audit Logs', icon: icons.audit },
          { href: '/admin/member-management', label: 'Member Management', icon: icons.memberManagement },
        ]
      : []),
  ]

  return (
    <>
      <div className="fixed left-0 top-0 right-0 z-40 bg-white border-b border-gray-200 md:hidden">
        <div className="flex items-center justify-between px-4 py-3">
          <div>
            <h2 className="text-lg font-bold text-primary">Member Portal</h2>
          </div>
          <button
            onClick={() => setIsOpen((current) => !current)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-100"
            aria-label="Open navigation"
          >
            <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 7h16M4 12h16M4 17h16" />
            </svg>
          </button>
        </div>
      </div>

      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 md:block ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}>
        <div className="p-6 pt-20 md:pt-6">
          <h2 className="text-xl font-bold text-primary">Member Portal</h2>
        </div>
        <nav className="px-4 pb-6">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setIsOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg mb-1 transition-colors ${
                pathname === link.href
                  ? 'bg-primary text-white'
                  : 'text-gray-600 hover:bg-secondary hover:text-primary'
              }`}
            >
              <span className="w-10 flex items-center justify-center text-gray-500">{link.icon}</span>
              <span>{link.label}</span>
            </Link>
          ))}
          <button
            onClick={() => {
              setIsOpen(false)
              signOut()
            }}
            className="flex items-center gap-3 px-4 py-3 rounded-lg w-full text-left text-gray-600 hover:bg-red-50 hover:text-red-600 transition-colors mt-4"
          >
            <span className="w-10 flex items-center justify-center text-gray-500">{icons.logout}</span>
            Logout
          </button>
        </nav>
      </aside>

      {isOpen && <div className="fixed inset-0 z-40 bg-black/30 md:hidden" onClick={() => setIsOpen(false)} />}
    </>
  )
}
