import React, { useState, useEffect } from 'react'
import { rankingsApi } from '../../services/rankings.api'
import { gamesApi } from '../../services/games.api'
import { useAuth } from '../../hooks/useAuth'
import Avatar from '../../components/common/Avatar'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import EmptyState from '../../components/common/EmptyState'

const SCOPES = [
  { key: 'global', label: 'Global' },
  { key: 'friends', label: 'Friends' },
  { key: 'self', label: 'Personal' },
]

export default function RankingsPage() {
  const { user } = useAuth()
  const [games, setGames] = useState([])
  const [selectedGame, setSelectedGame] = useState('')
  const [scope, setScope] = useState('global')
  const [rankings, setRankings] = useState([])
  const [loading, setLoading] = useState(false)
  const [loadingGames, setLoadingGames] = useState(true)

  useEffect(() => {
    gamesApi.list()
      .then(data => {
        const list = Array.isArray(data) ? data : data?.items || []
        setGames(list)
        if (list.length > 0) setSelectedGame(list[0].slug)
      })
      .catch(() => {})
      .finally(() => setLoadingGames(false))
  }, [])

  useEffect(() => {
    if (!selectedGame) return
    setLoading(true)
    rankingsApi.get(selectedGame, scope)
      .then(data => setRankings(Array.isArray(data) ? data : data?.items || []))
      .catch(() => setRankings([]))
      .finally(() => setLoading(false))
  }, [selectedGame, scope])

  const getRankIcon = (rank) => {
    if (rank === 1) return '🥇'
    if (rank === 2) return '🥈'
    if (rank === 3) return '🥉'
    return `#${rank}`
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Rankings</h1>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        {/* Game selector */}
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Game</label>
          {loadingGames ? (
            <div className="h-10 bg-gray-200 dark:bg-slate-700 rounded-lg animate-pulse" />
          ) : (
            <select
              value={selectedGame}
              onChange={e => setSelectedGame(e.target.value)}
              className="input w-full"
            >
              {games.map(g => (
                <option key={g.slug} value={g.slug}>{g.name}</option>
              ))}
            </select>
          )}
        </div>

        {/* Scope tabs */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Scope</label>
          <div className="flex gap-1 bg-gray-100 dark:bg-slate-800 rounded-xl p-1">
            {SCOPES.map(s => (
              <button
                key={s.key}
                onClick={() => setScope(s.key)}
                className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  scope === s.key
                    ? 'bg-white dark:bg-slate-700 text-primary-600 dark:text-primary-400 shadow'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Rankings Table */}
      <div className="card overflow-hidden">
        {loading ? (
          <div className="flex justify-center py-16"><LoadingSpinner size="lg" /></div>
        ) : rankings.length === 0 ? (
          <EmptyState icon="📊" title="No rankings yet" description="Play some games to appear on the leaderboard!" />
        ) : (
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 dark:bg-slate-800 border-b border-gray-200 dark:border-slate-700">
                <th className="text-left p-4 text-sm font-medium text-gray-500 dark:text-gray-400 w-16">Rank</th>
                <th className="text-left p-4 text-sm font-medium text-gray-500 dark:text-gray-400">Player</th>
                <th className="text-right p-4 text-sm font-medium text-gray-500 dark:text-gray-400">Best Score</th>
                <th className="text-right p-4 text-sm font-medium text-gray-500 dark:text-gray-400">Wins</th>
                <th className="text-right p-4 text-sm font-medium text-gray-500 dark:text-gray-400">Plays</th>
              </tr>
            </thead>
            <tbody>
              {rankings.map((entry, idx) => {
                const rank = entry.rank || idx + 1
                const isMe = entry.user_id === user?.id || entry.user?.id === user?.id
                return (
                  <tr
                    key={entry.id || idx}
                    className={`border-b border-gray-200 dark:border-slate-700 last:border-0 transition-colors ${
                      isMe ? 'bg-primary-50 dark:bg-primary-900/20' : 'hover:bg-gray-50 dark:hover:bg-slate-800/50'
                    }`}
                  >
                    <td className="p-4">
                      <span className={`font-bold ${rank <= 3 ? 'text-xl' : 'text-gray-700 dark:text-gray-300 text-sm'}`}>
                        {getRankIcon(rank)}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <Avatar name={entry.user?.name || entry.name || 'Player'} src={entry.user?.avatar_url} size="sm" />
                        <div>
                          <p className={`font-medium ${isMe ? 'text-primary-700 dark:text-primary-300' : 'text-gray-900 dark:text-white'}`}>
                            {entry.user?.name || entry.name || 'Player'}
                            {isMe && <span className="ml-1 text-xs">(You)</span>}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-right font-bold text-primary-600 dark:text-primary-400">
                      {(entry.best_score || 0).toLocaleString()}
                    </td>
                    <td className="p-4 text-right text-gray-700 dark:text-gray-300">{entry.wins || 0}</td>
                    <td className="p-4 text-right text-gray-500 dark:text-gray-400">{entry.total_plays || 0}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
