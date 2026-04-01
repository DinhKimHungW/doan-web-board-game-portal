import React, { useState, useEffect } from 'react'
import { adminApi } from '../../services/admin.api'
import LoadingSpinner from '../../components/common/LoadingSpinner'

const GAME_ICONS = {
  'tic-tac-toe': '⭕', caro4: '⊞', caro5: '⊟', snake: '🐍',
  match3: '💎', memory: '🃏', draw: '🎨',
}

export default function AdminStatsPage() {
  const [overview, setOverview] = useState(null)
  const [gameStats, setGameStats] = useState([])
  const [userStats, setUserStats] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      adminApi.getOverviewStats().catch(() => null),
      adminApi.getGameStats().catch(() => []),
      adminApi.getUserStats().catch(() => []),
    ]).then(([ov, gs, us]) => {
      setOverview(ov)
      setGameStats(Array.isArray(gs) ? gs : gs?.items || [])
      setUserStats(Array.isArray(us) ? us : us?.items || [])
    }).finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="p-8 flex justify-center"><LoadingSpinner size="lg" /></div>

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Statistics</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">System usage analytics</p>
      </div>

      {/* Overview Cards */}
      {overview && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: 'Total Users', value: overview.total_users, icon: '👥' },
            { label: 'Active Users', value: overview.active_users, icon: '🟢' },
            { label: 'Sessions', value: overview.total_sessions, icon: '🎮' },
            { label: 'Reviews', value: overview.total_reviews, icon: '⭐' },
            { label: 'Friendships', value: overview.total_friendships, icon: '🤝' },
            { label: 'Messages', value: overview.total_messages, icon: '💬' },
            { label: 'Achievements', value: overview.total_user_achievements, icon: '🏆' },
            { label: 'Games Enabled', value: overview.enabled_games, icon: '✅' },
          ].map(item => (
            <div key={item.label} className="card p-4 text-center">
              <div className="text-2xl mb-1">{item.icon}</div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{item.value?.toLocaleString() ?? '—'}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{item.label}</p>
            </div>
          ))}
        </div>
      )}

      {/* Game Stats */}
      <div className="card overflow-hidden">
        <div className="p-5 border-b border-gray-200 dark:border-slate-700">
          <h2 className="font-bold text-lg text-gray-900 dark:text-white">Game Statistics</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">Usage stats per game</p>
        </div>
        {gameStats.length === 0 ? (
          <p className="p-8 text-center text-gray-400">No game stats available</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 dark:bg-slate-800">
                  <th className="text-left p-4 text-sm font-medium text-gray-500 dark:text-gray-400">Game</th>
                  <th className="text-right p-4 text-sm font-medium text-gray-500 dark:text-gray-400">Sessions</th>
                  <th className="text-right p-4 text-sm font-medium text-gray-500 dark:text-gray-400">Finished</th>
                  <th className="text-right p-4 text-sm font-medium text-gray-500 dark:text-gray-400">Avg Score</th>
                  <th className="text-right p-4 text-sm font-medium text-gray-500 dark:text-gray-400">Avg Rating</th>
                  <th className="text-right p-4 text-sm font-medium text-gray-500 dark:text-gray-400">Reviews</th>
                </tr>
              </thead>
              <tbody>
                {gameStats.map(gs => (
                  <tr key={gs.game_id || gs.slug} className="border-t border-gray-200 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-800/50">
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <span>{GAME_ICONS[gs.slug] || '🎮'}</span>
                        <span className="font-medium text-gray-900 dark:text-white">{gs.name || gs.slug}</span>
                      </div>
                    </td>
                    <td className="p-4 text-right text-gray-700 dark:text-gray-300">{(gs.total_sessions || 0).toLocaleString()}</td>
                    <td className="p-4 text-right text-gray-700 dark:text-gray-300">{(gs.finished_sessions || 0).toLocaleString()}</td>
                    <td className="p-4 text-right text-gray-700 dark:text-gray-300">
                      {gs.avg_score ? Math.round(gs.avg_score).toLocaleString() : '—'}
                    </td>
                    <td className="p-4 text-right">
                      <span className="text-yellow-500">★</span>{' '}
                      <span className="text-gray-700 dark:text-gray-300">
                        {gs.avg_rating ? parseFloat(gs.avg_rating).toFixed(1) : '—'}
                      </span>
                    </td>
                    <td className="p-4 text-right text-gray-700 dark:text-gray-300">{gs.review_count || 0}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Top Users */}
      <div className="card overflow-hidden">
        <div className="p-5 border-b border-gray-200 dark:border-slate-700">
          <h2 className="font-bold text-lg text-gray-900 dark:text-white">Top Players</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">Users with most games played</p>
        </div>
        {userStats.length === 0 ? (
          <p className="p-8 text-center text-gray-400">No user stats available</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 dark:bg-slate-800">
                  <th className="text-left p-4 text-sm font-medium text-gray-500 dark:text-gray-400">#</th>
                  <th className="text-left p-4 text-sm font-medium text-gray-500 dark:text-gray-400">User</th>
                  <th className="text-right p-4 text-sm font-medium text-gray-500 dark:text-gray-400">Games Played</th>
                  <th className="text-right p-4 text-sm font-medium text-gray-500 dark:text-gray-400">Total Wins</th>
                  <th className="text-right p-4 text-sm font-medium text-gray-500 dark:text-gray-400">Best Score</th>
                </tr>
              </thead>
              <tbody>
                {userStats.map((us, idx) => (
                  <tr key={us.user_id || idx} className="border-t border-gray-200 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-800/50">
                    <td className="p-4 text-gray-500 dark:text-gray-400 font-medium">{idx + 1}</td>
                    <td className="p-4 font-medium text-gray-900 dark:text-white">{us.name || us.user?.name || '—'}</td>
                    <td className="p-4 text-right text-gray-700 dark:text-gray-300">{(us.total_plays || 0).toLocaleString()}</td>
                    <td className="p-4 text-right text-gray-700 dark:text-gray-300">{(us.total_wins || 0).toLocaleString()}</td>
                    <td className="p-4 text-right text-primary-600 dark:text-primary-400 font-bold">
                      {(us.best_score || 0).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
