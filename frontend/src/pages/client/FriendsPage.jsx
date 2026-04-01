import React, { useState, useEffect } from 'react'
import { friendsApi } from '../../services/friends.api'
import { usersApi } from '../../services/users.api'
import { useAuth } from '../../hooks/useAuth'
import { useDebounce } from '../../hooks/useDebounce'
import Avatar from '../../components/common/Avatar'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import EmptyState from '../../components/common/EmptyState'

const TABS = ['Friends', 'Requests', 'Find Users']

export default function FriendsPage() {
  const { user } = useAuth()
  const [tab, setTab] = useState(0)
  const [friends, setFriends] = useState([])
  const [requests, setRequests] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [loading, setLoading] = useState(true)
  const [searching, setSearching] = useState(false)
  const [actionLoading, setActionLoading] = useState({})
  const debouncedQuery = useDebounce(searchQuery, 400)

  const loadFriends = async () => {
    try {
      const data = await friendsApi.list()
      setFriends(Array.isArray(data) ? data : data?.items || [])
    } catch { setFriends([]) }
  }

  const loadRequests = async () => {
    try {
      const data = await friendsApi.getPendingRequests()
      setRequests(Array.isArray(data) ? data : data?.items || [])
    } catch { setRequests([]) }
  }

  useEffect(() => {
    setLoading(true)
    Promise.all([loadFriends(), loadRequests()]).finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    if (!debouncedQuery.trim()) { setSearchResults([]); return }
    setSearching(true)
    usersApi.searchUsers(debouncedQuery)
      .then(data => setSearchResults(Array.isArray(data) ? data : data?.items || []))
      .catch(() => setSearchResults([]))
      .finally(() => setSearching(false))
  }, [debouncedQuery])

  const doAction = async (key, fn) => {
    setActionLoading(p => ({ ...p, [key]: true }))
    try { await fn() } catch { /* ignore */ }
    setActionLoading(p => ({ ...p, [key]: false }))
    await Promise.all([loadFriends(), loadRequests()])
  }

  const isFriend = (userId) => friends.some(f => f.id === userId || f.friend_id === userId || f.user_id === userId)
  const hasPending = (userId) => requests.some(r =>
    (r.requester_id === user?.id && r.receiver_id === userId) ||
    (r.receiver_id === user?.id && r.requester_id === userId)
  )

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Friends</h1>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 dark:bg-slate-800 rounded-xl p-1 mb-6">
        {TABS.map((t, i) => (
          <button
            key={t}
            onClick={() => setTab(i)}
            className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
              tab === i
                ? 'bg-white dark:bg-slate-700 text-primary-600 dark:text-primary-400 shadow'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            {t}
            {i === 1 && requests.filter(r => r.receiver_id === user?.id && r.status === 'PENDING').length > 0 && (
              <span className="ml-1.5 bg-red-500 text-white rounded-full text-xs px-1.5">
                {requests.filter(r => r.receiver_id === user?.id && r.status === 'PENDING').length}
              </span>
            )}
          </button>
        ))}
      </div>

      {loading ? <div className="flex justify-center py-12"><LoadingSpinner /></div> : (
        <>
          {/* Friends List */}
          {tab === 0 && (
            <div className="space-y-3">
              {friends.length === 0 ? (
                <EmptyState icon="👥" title="No friends yet" description="Search for users and add them as friends" />
              ) : friends.map(f => {
                const friend = f.friend || f
                return (
                  <div key={f.id} className="card p-4 flex items-center gap-4">
                    <Avatar name={friend.name} src={friend.avatar_url} size="md" />
                    <div className="flex-1">
                      <p className="font-medium text-gray-900 dark:text-white">{friend.name}</p>
                      <p className="text-sm text-gray-500">{friend.email}</p>
                    </div>
                    <button
                      onClick={() => doAction(`rm-${f.id}`, () => friendsApi.removeFriend(friend.id || f.friend_id))}
                      disabled={actionLoading[`rm-${f.id}`]}
                      className="btn text-sm py-1.5 px-3 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900/50"
                    >
                      {actionLoading[`rm-${f.id}`] ? '...' : 'Remove'}
                    </button>
                  </div>
                )
              })}
            </div>
          )}

          {/* Pending Requests */}
          {tab === 1 && (
            <div className="space-y-3">
              {requests.filter(r => r.status === 'PENDING').length === 0 ? (
                <EmptyState icon="📨" title="No pending requests" description="When someone sends you a friend request, it'll appear here" />
              ) : requests.filter(r => r.status === 'PENDING').map(r => {
                const isReceived = r.receiver_id === user?.id
                const person = isReceived ? r.requester : r.receiver
                return (
                  <div key={r.id} className="card p-4 flex items-center gap-4">
                    <Avatar name={person?.name || 'User'} src={person?.avatar_url} size="md" />
                    <div className="flex-1">
                      <p className="font-medium text-gray-900 dark:text-white">{person?.name || 'User'}</p>
                      <p className="text-xs text-gray-500">{isReceived ? 'Sent you a friend request' : 'Request sent'}</p>
                    </div>
                    {isReceived && (
                      <div className="flex gap-2">
                        <button
                          onClick={() => doAction(`acc-${r.id}`, () => friendsApi.acceptRequest(r.id))}
                          disabled={actionLoading[`acc-${r.id}`]}
                          className="btn btn-primary text-sm py-1.5 px-3"
                        >
                          {actionLoading[`acc-${r.id}`] ? '...' : 'Accept'}
                        </button>
                        <button
                          onClick={() => doAction(`rej-${r.id}`, () => friendsApi.rejectRequest(r.id))}
                          disabled={actionLoading[`rej-${r.id}`]}
                          className="btn btn-secondary text-sm py-1.5 px-3"
                        >
                          {actionLoading[`rej-${r.id}`] ? '...' : 'Decline'}
                        </button>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          )}

          {/* Search Users */}
          {tab === 2 && (
            <div>
              <input
                type="search"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="input w-full mb-4"
                placeholder="Search by name or email..."
              />
              {searching ? (
                <div className="flex justify-center py-8"><LoadingSpinner /></div>
              ) : searchResults.length === 0 && debouncedQuery ? (
                <EmptyState icon="🔍" title="No users found" description={`No results for "${debouncedQuery}"`} />
              ) : (
                <div className="space-y-3">
                  {searchResults.filter(u => u.id !== user?.id).map(u => (
                    <div key={u.id} className="card p-4 flex items-center gap-4">
                      <Avatar name={u.name} src={u.avatar_url} size="md" />
                      <div className="flex-1">
                        <p className="font-medium text-gray-900 dark:text-white">{u.name}</p>
                        <p className="text-sm text-gray-500">{u.email}</p>
                      </div>
                      {isFriend(u.id) ? (
                        <span className="text-sm text-green-500 font-medium">Friends</span>
                      ) : hasPending(u.id) ? (
                        <span className="text-sm text-gray-400">Pending</span>
                      ) : (
                        <button
                          onClick={() => doAction(`add-${u.id}`, () => friendsApi.sendRequest(u.id))}
                          disabled={actionLoading[`add-${u.id}`]}
                          className="btn btn-primary text-sm py-1.5 px-3"
                        >
                          {actionLoading[`add-${u.id}`] ? '...' : 'Add Friend'}
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  )
}
