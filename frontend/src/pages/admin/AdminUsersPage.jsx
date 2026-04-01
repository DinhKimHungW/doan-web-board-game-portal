import React, { useState, useEffect } from 'react'
import { adminApi } from '../../services/admin.api'
import Avatar from '../../components/common/Avatar'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import Badge from '../../components/common/Badge'
import Pagination from '../../components/common/Pagination'
import { useDebounce } from '../../hooks/useDebounce'

export default function AdminUsersPage() {
  const [users, setUsers] = useState([])
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 })
  const [loading, setLoading] = useState(true)
  const [query, setQuery] = useState('')
  const [actionLoading, setActionLoading] = useState({})
  const debouncedQuery = useDebounce(query, 400)

  const loadUsers = async (page = 1) => {
    setLoading(true)
    try {
      const res = await adminApi.getUsers({ page, limit: 15, q: debouncedQuery || undefined })
      const items = res?.items || res || []
      setUsers(Array.isArray(items) ? items : [])
      setPagination({
        page: res?.page || 1,
        totalPages: res?.totalPages || 1,
        total: res?.total || items.length,
      })
    } catch { setUsers([]) }
    setLoading(false)
  }

  useEffect(() => { loadUsers(1) }, [debouncedQuery])

  const handleToggleActive = async (userId, currentActive) => {
    setActionLoading(p => ({ ...p, [userId]: true }))
    try {
      await adminApi.updateUser(userId, { is_active: !currentActive })
      setUsers(prev => prev.map(u => u.id === userId ? { ...u, is_active: !currentActive } : u))
    } catch { /* ignore */ }
    setActionLoading(p => ({ ...p, [userId]: false }))
  }

  const handleToggleRole = async (userId, currentRole) => {
    const newRole = currentRole === 'ADMIN' ? 'USER' : 'ADMIN'
    if (!confirm(`Change role to ${newRole}?`)) return
    setActionLoading(p => ({ ...p, [`role-${userId}`]: true }))
    try {
      await adminApi.updateUser(userId, { role: newRole })
      setUsers(prev => prev.map(u => u.id === userId ? { ...u, role: newRole } : u))
    } catch { /* ignore */ }
    setActionLoading(p => ({ ...p, [`role-${userId}`]: false }))
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Users</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Total: {pagination.total}</p>
        </div>
      </div>

      {/* Search */}
      <div className="mb-4">
        <input
          type="search"
          value={query}
          onChange={e => setQuery(e.target.value)}
          className="input w-full max-w-md"
          placeholder="Search by name or email..."
        />
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        {loading ? (
          <div className="flex justify-center py-16"><LoadingSpinner size="lg" /></div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 dark:bg-slate-800 border-b border-gray-200 dark:border-slate-700">
                  <th className="text-left p-4 text-sm font-medium text-gray-500 dark:text-gray-400">User</th>
                  <th className="text-left p-4 text-sm font-medium text-gray-500 dark:text-gray-400">Email</th>
                  <th className="text-center p-4 text-sm font-medium text-gray-500 dark:text-gray-400">Role</th>
                  <th className="text-center p-4 text-sm font-medium text-gray-500 dark:text-gray-400">Status</th>
                  <th className="text-center p-4 text-sm font-medium text-gray-500 dark:text-gray-400">Joined</th>
                  <th className="text-center p-4 text-sm font-medium text-gray-500 dark:text-gray-400">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-gray-400">No users found</td>
                  </tr>
                ) : users.map(u => (
                  <tr key={u.id} className="border-b border-gray-200 dark:border-slate-700 last:border-0 hover:bg-gray-50 dark:hover:bg-slate-800/50">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <Avatar name={u.name} src={u.avatar_url} size="sm" />
                        <span className="font-medium text-gray-900 dark:text-white">{u.name}</span>
                      </div>
                    </td>
                    <td className="p-4 text-sm text-gray-600 dark:text-gray-400">{u.email}</td>
                    <td className="p-4 text-center">
                      <Badge variant={u.role === 'ADMIN' ? 'warning' : 'info'}>{u.role}</Badge>
                    </td>
                    <td className="p-4 text-center">
                      <Badge variant={u.is_active ? 'success' : 'error'}>
                        {u.is_active ? 'Active' : 'Inactive'}
                      </Badge>
                    </td>
                    <td className="p-4 text-center text-sm text-gray-500">
                      {u.created_at ? new Date(u.created_at).toLocaleDateString() : '—'}
                    </td>
                    <td className="p-4 text-center">
                      <div className="flex gap-2 justify-center">
                        <button
                          onClick={() => handleToggleActive(u.id, u.is_active)}
                          disabled={actionLoading[u.id]}
                          className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-colors ${
                            u.is_active
                              ? 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 hover:bg-red-200'
                              : 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 hover:bg-green-200'
                          }`}
                        >
                          {actionLoading[u.id] ? '...' : (u.is_active ? 'Deactivate' : 'Activate')}
                        </button>
                        <button
                          onClick={() => handleToggleRole(u.id, u.role)}
                          disabled={actionLoading[`role-${u.id}`]}
                          className="text-xs px-3 py-1.5 rounded-lg font-medium bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-slate-600"
                        >
                          {actionLoading[`role-${u.id}`] ? '...' : (u.role === 'ADMIN' ? '→ User' : '→ Admin')}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {pagination.totalPages > 1 && (
        <div className="mt-4">
          <Pagination
            page={pagination.page}
            totalPages={pagination.totalPages}
            onPageChange={(p) => loadUsers(p)}
          />
        </div>
      )}
    </div>
  )
}
