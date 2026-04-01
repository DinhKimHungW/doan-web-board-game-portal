import React, { useState, useEffect } from 'react'
import { useAuth } from '../../hooks/useAuth'
import { usersApi } from '../../services/users.api'
import { achievementsApi } from '../../services/achievements.api'
import Avatar from '../../components/common/Avatar'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import Badge from '../../components/common/Badge'

export default function ProfilePage() {
  const { user, setUser } = useAuth()
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState({ name: '', bio: '', avatar_url: '' })
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)
  const [myAchievements, setMyAchievements] = useState([])
  const [loadingAch, setLoadingAch] = useState(true)

  useEffect(() => {
    if (user) setForm({ name: user.name || '', bio: user.bio || '', avatar_url: user.avatar_url || '' })
  }, [user])

  useEffect(() => {
    achievementsApi.listMine()
      .then(data => setMyAchievements(Array.isArray(data) ? data : []))
      .catch(() => {})
      .finally(() => setLoadingAch(false))
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    setError(null)
    try {
      const updated = await usersApi.updateProfile({ name: form.name, bio: form.bio, avatar_url: form.avatar_url })
      if (setUser) setUser(prev => ({ ...prev, ...updated }))
      setEditing(false)
    } catch (err) {
      setError(err?.response?.data?.message || 'Update failed')
    }
    setSubmitting(false)
  }

  if (!user) return <div className="p-8 flex justify-center"><LoadingSpinner /></div>

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">
      {/* Profile Card */}
      <div className="card p-6">
        <div className="flex items-center gap-6">
          <Avatar name={user.name} src={user.avatar_url} size="xl" />
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{user.name}</h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">{user.email}</p>
            {user.bio && <p className="text-gray-600 dark:text-gray-300 mt-2">{user.bio}</p>}
            <div className="flex items-center gap-2 mt-2">
              <Badge variant={user.role === 'ADMIN' ? 'warning' : 'info'}>{user.role}</Badge>
            </div>
          </div>
          <button onClick={() => setEditing(!editing)} className="btn btn-secondary">
            {editing ? 'Cancel' : 'Edit Profile'}
          </button>
        </div>

        {editing && (
          <form onSubmit={handleSubmit} className="mt-6 space-y-4 border-t border-gray-200 dark:border-gray-700 pt-6">
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Display Name</label>
              <input
                type="text"
                value={form.name}
                onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                className="input w-full"
                required
                minLength={2}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Bio</label>
              <textarea
                value={form.bio}
                onChange={e => setForm(f => ({ ...f, bio: e.target.value }))}
                rows={3}
                className="input w-full resize-none"
                placeholder="Tell something about yourself..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Avatar URL</label>
              <input
                type="url"
                value={form.avatar_url}
                onChange={e => setForm(f => ({ ...f, avatar_url: e.target.value }))}
                className="input w-full"
                placeholder="https://..."
              />
            </div>
            <div className="flex justify-end gap-3">
              <button type="button" onClick={() => setEditing(false)} className="btn btn-secondary">Cancel</button>
              <button type="submit" disabled={submitting} className="btn btn-primary disabled:opacity-50">
                {submitting ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Recent Achievements */}
      <div className="card p-6">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
          Achievements ({myAchievements.length})
        </h2>
        {loadingAch ? (
          <LoadingSpinner />
        ) : myAchievements.length === 0 ? (
          <p className="text-gray-400 text-sm">No achievements yet. Start playing to earn some!</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {myAchievements.slice(0, 6).map(ua => (
              <div key={ua.id} className="bg-primary-50 dark:bg-primary-900/20 rounded-xl p-3 text-center">
                <div className="text-2xl mb-1">{ua.achievement?.icon || '🏆'}</div>
                <p className="text-xs font-medium text-primary-700 dark:text-primary-300">{ua.achievement?.name || 'Achievement'}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Stats placeholder */}
      <div className="card p-6">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Account Info</h2>
        <div className="text-sm text-gray-500 dark:text-gray-400 space-y-1">
          <p>Member since: {user.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}</p>
          <p>Theme: {user.theme_preference || 'light'}</p>
        </div>
      </div>
    </div>
  )
}
