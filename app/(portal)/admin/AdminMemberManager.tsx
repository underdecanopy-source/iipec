'use client'

import { useEffect, useMemo, useState, ReactNode } from 'react'

type AdminMember = {
  id: string
  name: string
  email: string
  phone: string | null
  role: string
  status: string
  lastLoginAt?: string | null
  createdAt: string
}

type SortableColumn = keyof AdminMember

function statusLabel(status: string) {
  return status.toLowerCase().replace(/^\w/, (letter) => letter.toUpperCase())
}

function downloadCsv(members: AdminMember[]) {
  const headers = ['Name', 'Email', 'Phone', 'Role', 'Status', 'Last Login', 'Joined']
  const rows = members.map((member) => [
    member.name,
    member.email,
    member.phone || 'N/A',
    member.role,
    statusLabel(member.status),
    member.lastLoginAt ? new Date(member.lastLoginAt).toLocaleDateString() : 'Never',
    new Date(member.createdAt).toLocaleDateString(),
  ])
  const csv = [headers, ...rows]
    .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(','))
    .join('\n')

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = 'iipec-members.csv'
  link.click()
  URL.revokeObjectURL(url)
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}

function openPrintableMembers(members: AdminMember[]) {
  const printWindow = window.open('', '_blank')
  if (!printWindow) {
    return false
  }

  const rows = members.map((member) => `
    <tr>
      <td>${escapeHtml(member.name)}</td>
      <td>${escapeHtml(member.email)}</td>
      <td>${escapeHtml(member.phone || 'N/A')}</td>
      <td>${escapeHtml(member.role)}</td>
      <td>${escapeHtml(statusLabel(member.status))}</td>
      <td>${member.lastLoginAt ? escapeHtml(new Date(member.lastLoginAt).toLocaleDateString()) : 'Never'}</td>
      <td>${escapeHtml(new Date(member.createdAt).toLocaleDateString())}</td>
    </tr>
  `).join('')

  printWindow.document.write(`
    <!doctype html>
    <html>
      <head>
        <title>IIPEC Members</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 24px; color: #1f2937; }
          h1 { color: #0f3d3e; margin-bottom: 4px; }
          p { color: #4b5563; margin-top: 0; }
          table { width: 100%; border-collapse: collapse; margin-top: 20px; font-size: 13px; }
          th, td { border: 1px solid #d1d5db; padding: 8px; text-align: left; }
          th { background: #f3f4f6; }
          .actions { display: flex; gap: 8px; margin: 16px 0; }
          button { padding: 9px 13px; border: 0; border-radius: 6px; background: #0f3d3e; color: white; cursor: pointer; }
          @media print { .actions { display: none; } body { margin: 12mm; } }
        </style>
      </head>
      <body>
        <h1>IIPEC Members</h1>
        <p>${members.length} member${members.length === 1 ? '' : 's'} listed</p>
        <div class="actions">
          <button onclick="window.print()">Print / Save as PDF</button>
          <button onclick="window.close()">Close</button>
        </div>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Role</th>
              <th>Status</th>
              <th>Last Login</th>
              <th>Joined</th>
            </tr>
          </thead>
          <tbody>${rows}</tbody>
        </table>
      </body>
    </html>
  `)
  printWindow.document.close()
  return true
}

export function AdminMemberManager() {
  const [members, setMembers] = useState<AdminMember[]>([])
  const [loading, setLoading] = useState(true)
  const [savingId, setSavingId] = useState<string | null>(null)
  const [error, setError] = useState('')
  const [query, setQuery] = useState('')
  const [sortConfig, setSortConfig] = useState<{ key: SortableColumn; direction: 'ascending' | 'descending' } | null>({
    key: 'createdAt',
    direction: 'descending',
  })

  useEffect(() => {
    fetch('/api/admin/all-members')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Unable to load members')
        }
        return response.json()
      })
      .then(setMembers)
      .catch(() => setError('Unable to load members.'))
      .finally(() => setLoading(false))
  }, [])

  const sortedAndFilteredMembers = useMemo(() => {
    let processableMembers = [...members]

    // Filtering
    const search = query.trim().toLowerCase()
    if (search) {
      processableMembers = processableMembers.filter((member) =>
        [member.name, member.email, member.phone, member.role, member.status].some(
          (value) => value && value.toLowerCase().includes(search)
        )
      )
    }

    // Sorting
    if (sortConfig !== null) {
      processableMembers.sort((a, b) => {
        const aValue = a[sortConfig.key]
        const bValue = b[sortConfig.key]

        if (aValue === null || aValue === undefined) return 1
        if (bValue === null || bValue === undefined) return -1

        if (aValue < bValue) {
          return sortConfig.direction === 'ascending' ? -1 : 1
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'ascending' ? 1 : -1
        }
        return 0
      })
    }

    return processableMembers
  }, [members, query, sortConfig])

  async function updateStatus(member: AdminMember, status: 'ACTIVE' | 'SUSPENDED' | 'DISABLED') {
    const action = status.toLowerCase()
    const confirmed = window.confirm(`Are you sure you want to mark ${member.name} as ${action}?`)
    if (!confirmed) return

    setSavingId(member.id)
    setError('')

    const response = await fetch(`/api/admin/users/${member.id}/status`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    })

    if (response.ok) {
      const updated = await response.json()
      setMembers((current) =>
        current.map((item) => (item.id === updated.id ? { ...item, status: updated.status } : item))
      )
    } else {
      const data = await response.json().catch(() => ({}))
      setError(data.error || 'Unable to update member status.')
    }

    setSavingId(null)
  }

  async function deleteAccount(member: AdminMember) {
    const confirmed = window.confirm(`Are you sure you want to PERMANENTLY DELETE ${member.name}'s account? This action cannot be undone.`)
    if (!confirmed) return

    setSavingId(member.id)
    setError('')

    const response = await fetch(`/api/admin/users/${member.id}`, {
      method: 'DELETE',
    })

    if (response.ok) {
      setMembers((current) => current.filter((item) => item.id !== member.id))
    } else {
      const data = await response.json().catch(() => ({}))
      setError(data.error || 'Unable to delete member account.')
    }

    setSavingId(null)
  }

  const requestSort = (key: SortableColumn) => {
    let direction: 'ascending' | 'descending' = 'ascending'
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending'
    }
    setSortConfig({ key, direction })
  }

  const SortableHeader = ({ column, children }: { column: SortableColumn; children: ReactNode }) => {
    const isSorted = sortConfig?.key === column
    const sortIcon = isSorted ? (sortConfig?.direction === 'ascending' ? '▲' : '▼') : ''

    return (
      <th
        className="py-3 pr-4 font-semibold cursor-pointer select-none"
        onClick={() => requestSort(column)}
      >
        {children}
        <span className={`ml-2 text-primary ${isSorted ? 'opacity-100' : 'opacity-0 group-hover:opacity-50'}`}>
          {sortIcon}
        </span>
      </th>
    )
  }


  return (
    <section className="bg-white rounded-xl p-6 shadow-sm">
      <div className="flex flex-col gap-4 mb-5 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="text-xl font-bold text-primary">Member Management</h2>
          <p className="text-sm text-gray-600">View, print, export, suspend, or disable member accounts.</p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <button onClick={() => window.print()} className="btn-outline text-sm px-4 py-2">
            Print
          </button>
          <button
            onClick={() => {
              const opened = openPrintableMembers(sortedAndFilteredMembers)
              if (!opened) setError('Please allow popups to open the printable member list.')
            }}
            className="btn-outline text-sm px-4 py-2"
          >
            Printable PDF
          </button>
          <button onClick={() => downloadCsv(sortedAndFilteredMembers)} className="btn-accent text-sm px-4 py-2">
            Download CSV
          </button>
        </div>
      </div>

      {error && <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4">{error}</div>}

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">Search members</label>
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search by name, email, phone, role, or status"
          className="w-full rounded-lg border border-gray-300 px-3 py-2"
        />
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[820px] text-left text-sm">
          <thead>
            <tr className="border-b border-gray-200 text-gray-500 group">
              <SortableHeader column="name">Name</SortableHeader>
              <SortableHeader column="email">Email</SortableHeader>
              <SortableHeader column="phone">Phone</SortableHeader>
              <SortableHeader column="role">Role</SortableHeader>
              <SortableHeader column="status">Status</SortableHeader>
              <SortableHeader column="lastLoginAt">Last Login</SortableHeader>
              <SortableHeader column="createdAt">Joined</SortableHeader>
              <th className="py-3 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td className="py-4 text-gray-600" colSpan={8}>Loading members...</td>
              </tr>
            ) : sortedAndFilteredMembers.length === 0 ? (
              <tr>
                <td className="py-4 text-gray-600" colSpan={8}>No members found.</td>
              </tr>
            ) : (
              sortedAndFilteredMembers.map((member) => (
                <tr key={member.id} className="border-b border-gray-100">
                  <td className="py-3 pr-4 font-medium text-primary">{member.name}</td>
                  <td className="py-3 pr-4 text-gray-600">{member.email}</td>
                  <td className="py-3 pr-4 text-gray-600">{member.phone || 'N/A'}</td>
                  <td className="py-3 pr-4 text-gray-600">{member.role}</td>
                  <td className="py-3 pr-4">
                    <span className="rounded-full bg-secondary px-3 py-1 text-xs font-semibold text-primary">
                      {statusLabel(member.status)}
                    </span>
                  </td>
                  <td className="py-3 pr-4 text-gray-600">
                    {member.lastLoginAt ? new Date(member.lastLoginAt).toLocaleDateString() : 'Never'}
                  </td>
                  <td className="py-3 pr-4 text-gray-600">{new Date(member.createdAt).toLocaleDateString()}</td>
                  <td className="py-3">
                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() => updateStatus(member, member.status === 'SUSPENDED' ? 'ACTIVE' : 'SUSPENDED')}
                        disabled={savingId === member.id || member.status === 'DISABLED'}
                        className="btn-outline text-xs px-3 py-2 disabled:opacity-50"
                      >
                        {member.status === 'SUSPENDED' ? 'Activate' : 'Suspend'}
                      </button>
                      <button
                        onClick={() => updateStatus(member, 'DISABLED')}
                        disabled={savingId === member.id || member.status === 'DISABLED'}
                        className="btn-danger text-xs px-3 py-2 disabled:opacity-50"
                      >
                        Disable
                      </button>
                      <button
                        onClick={() => deleteAccount(member)}
                        disabled={savingId === member.id}
                        className="btn-danger text-xs px-3 py-2 disabled:opacity-50"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  )
}

