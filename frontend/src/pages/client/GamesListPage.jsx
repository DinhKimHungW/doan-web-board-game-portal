import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { gamesApi } from '../../services/games.api'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import Badge from '../../components/common/Badge'
import StarRating from '../../components/common/StarRating'

const GAME_META = {
  'tic-tac-toe': { icon: '⭕', color: 'from-blue-500 to-purple-600' },
  caro4: { icon: '⊞', color: 'from-green-500 to-teal-600' },
  caro5: { icon: '⊟', color: 'from-yellow-500 to-orange-600' },
  snake: { icon: '🐍', color: 'from-green-600 to-emerald-700' },
  match3: { icon: '💎', color: 'from-pink-500 to-rose-600' },
  memory: { icon: '🃏', color: 'from-purple-500 to-indigo-600' },
  draw: { icon: '🎨', color: 'from-orange-500 to-red-600' },
}

export default function GamesListPage() {
  const [games, setGames] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    gamesApi.list()
      .then(data => setGames(Array.isArray(data) ? data : data?.items || []))
      .catch(() => setError('Failed to load games'))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="p-8 flex justify-center"><LoadingSpinner size="lg" /></div>
  if (error) return <div className="p-8 text-center text-red-500">{error}</div>

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Games</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">Choose a game and start playing</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {games.map(game => {
          const meta = GAME_META[game.slug] || { icon: '🎮', color: 'from-gray-500 to-gray-700' }
          return (
            <div key={game.id} className="card overflow-hidden hover:shadow-lg transition-shadow group">
              {/* Card Header */}
              <div className={`h-32 bg-gradient-to-br ${meta.color} flex items-center justify-center relative`}>
                <span className="text-5xl">{meta.icon}</span>
                {!game.is_enabled && (
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                    <Badge variant="error">Disabled</Badge>
                  </div>
                )}
              </div>

              {/* Card Body */}
              <div className="p-4">
                <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-1">{game.name}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-3 line-clamp-2">{game.description}</p>

                {/* Rating */}
                <div className="flex items-center gap-2 mb-4">
                  <StarRating value={parseFloat(game.avg_rating) || 0} readonly size="sm" />
                  <span className="text-xs text-gray-500">
                    {game.avg_rating ? parseFloat(game.avg_rating).toFixed(1) : 'No ratings'}
                    {game.review_count ? ` (${game.review_count})` : ''}
                  </span>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <Link
                    to={`/games/${game.slug}/play`}
                    className={`flex-1 btn btn-primary text-center text-sm py-2 ${!game.is_enabled ? 'opacity-50 pointer-events-none' : ''}`}
                  >
                    Play
                  </Link>
                  <Link
                    to={`/games/${game.slug}`}
                    className="btn btn-secondary text-sm py-2 px-3"
                  >
                    Info
                  </Link>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {games.length === 0 && (
        <div className="text-center py-16 text-gray-400">
          <div className="text-5xl mb-4">🎮</div>
          <p>No games available</p>
        </div>
      )}
    </div>
  )
}
