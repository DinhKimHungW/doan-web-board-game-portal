import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { adminApi } from '../../services/admin.api'
import LoadingSpinner from '../../components/common/LoadingSpinner'

const StatCard = ({ title, value, icon, color }) => (
  <div className="card p-6">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm text-gray-500 dark:text-gray-400">{title}</p>
        <p className={`text-3xl font-bold mt-1 ${color}`}>{value ?? '—'}</p>
      </div>
      <div className="text-4xl">{icon}</div>
    </div>
  </div>
)

export default function AdminDashboardPage() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    adminApi.getOverviewStats()
      .then(data => setStats(data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="p-8 flex justify-center"><LoadingSpinner size="lg" /></div>

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Admin Dashboard</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">System overview and management</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard title="Total Users" value={stats?.total_users?.toLocaleString()} icon="👥" color="text-blue-600 dark:text-blue-400" />
        <StatCard title="Total Games Played" value={stats?.total_sessions?.toLocaleString()} icon="🎮" color="text-green-600 dark:text-green-400" />
        <StatCard title="Active Games" value={stats?.enabled_games} icon="✅" color="text-primary-600 dark:text-primary-400" />
        <StatCard title="Total Reviews" value={stats?.total_reviews?.toLocaleString()} icon="⭐" color="text-yellow-600 dark:text-yellow-400" />
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <Link to="/admin/users" className="card p-6 hover:shadow-md transition-shadow flex items-center gap-4">
          <div className="text-3xl">👤</div>
          <div>
            <p className="font-bold text-gray-900 dark:text-white">Manage Users</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">View, activate, deactivate accounts</p>
          </div>
        </Link>
        <Link to="/admin/games" className="card p-6 hover:shadow-md transition-shadow flex items-center gap-4">
          <div className="text-3xl">🎲</div>
          <div>
            <p className="font-bold text-gray-900 dark:text-white">Manage Games</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">Enable/disable, configure games</p>
          </div>
        </Link>
        <Link to="/admin/stats" className="card p-6 hover:shadow-md transition-shadow flex items-center gap-4">
          <div className="text-3xl">📊</div>
          <div>
            <p className="font-bold text-gray-900 dark:text-white">Statistics</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">Detailed usage analytics</p>
          </div>
        </Link>
      </div>

      {/* Extra stats */}
      {stats && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard title="Friendships" value={stats?.total_friendships?.toLocaleString()} icon="🤝" color="text-purple-600 dark:text-purple-400" />
          <StatCard title="Messages Sent" value={stats?.total_messages?.toLocaleString()} icon="💬" color="text-indigo-600 dark:text-indigo-400" />
          <StatCard title="Achievements Earned" value={stats?.total_user_achievements?.toLocaleString()} icon="🏆" color="text-yellow-600 dark:text-yellow-400" />
          <StatCard title="Active Users" value={stats?.active_users?.toLocaleString()} icon="🟢" color="text-green-600 dark:text-green-400" />
        </div>
      )}
    </div>
  )
}
