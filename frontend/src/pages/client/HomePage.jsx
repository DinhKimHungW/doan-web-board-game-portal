import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { gamesApi } from '../../services/games.api'
import { achievementsApi } from '../../services/achievements.api'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import Badge from '../../components/common/Badge'

const GAME_META = [
  { slug: 'tic-tac-toe', name: 'Tic Tac Toe', icon: '⭕', desc: 'Classic 3×3 grid game', color: 'from-blue-500 to-purple-600' },
  { slug: 'caro4', name: 'Caro 4', icon: '⊞', desc: 'Get 4 in a row', color: 'from-green-500 to-teal-600' },
  { slug: 'caro5', name: 'Caro 5', icon: '⊟', desc: 'Gomoku - get 5 in a row', color: 'from-yellow-500 to-orange-600' },
  { slug: 'snake', name: 'Snake', icon: '🐍', desc: 'Eat food, grow longer', color: 'from-green-600 to-emerald-700' },
  { slug: 'match3', name: 'Match 3', icon: '💎', desc: 'Match colorful gems', color: 'from-pink-500 to-rose-600' },
  { slug: 'memory', name: 'Memory', icon: '🃏', desc: 'Find matching pairs', color: 'from-purple-500 to-indigo-600' },
  { slug: 'draw', name: 'Free Draw', icon: '🎨', desc: 'Paint your masterpiece', color: 'from-orange-500 to-red-600' },
]

export default function HomePage() {
  const { user } = useAuth()
  const [myAchievements, setMyAchievements] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        const ach = await achievementsApi.listMine()
        setMyAchievements(Array.isArray(ach) ? ach : [])
      } catch {}
      setLoading(false)
    }
    load()
  }, [])

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Hero */}
      <div className="bg-gradient-to-r from-primary-600 to-purple-700 rounded-2xl p-8 mb-8 text-white">
        <div className="flex items-center gap-4">
          <div className="text-5xl">🎮</div>
          <div>
            <h1 className="text-3xl font-bold">Welcome back, {user?.name?.split(' ')[0] || 'Player'}!</h1>
            <p className="text-primary-200 mt-1">Ready to play? Choose a game below.</p>
          </div>
        </div>
        <div className="flex gap-6 mt-6">
          <div className="bg-white/10 rounded-xl px-4 py-3 text-center">
            <p className="text-2xl font-bold">{myAchievements.length}</p>
            <p className="text-sm text-primary-200">Achievements</p>
          </div>
          <div className="bg-white/10 rounded-xl px-4 py-3 text-center">
            <p className="text-2xl font-bold">7</p>
            <p className="text-sm text-primary-200">Games Available</p>
          </div>
        </div>
      </div>

      {/* Games Grid */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Featured Games</h2>
          <Link to="/games" className="text-sm text-primary-600 dark:text-primary-400 hover:underline">View All →</Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {GAME_META.map(game => (
            <Link
              key={game.slug}
              to={`/games/${game.slug}`}
              className="card p-4 hover:shadow-lg transition-all duration-200 hover:-translate-y-1 group"
            >
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${game.color} flex items-center justify-center text-2xl mb-3 group-hover:scale-110 transition-transform`}>
                {game.icon}
              </div>
              <h3 className="font-bold text-gray-900 dark:text-white text-sm">{game.name}</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{game.desc}</p>
              <div className="mt-3">
                <span className="text-xs text-primary-600 dark:text-primary-400 font-medium group-hover:underline">Play Now →</span>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Quick links */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link to="/rankings" className="card p-4 hover:shadow-md transition-shadow flex items-center gap-3">
          <span className="text-3xl">🏆</span>
          <div>
            <p className="font-semibold text-gray-900 dark:text-white">Rankings</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">See top players</p>
          </div>
        </Link>
        <Link to="/achievements" className="card p-4 hover:shadow-md transition-shadow flex items-center gap-3">
          <span className="text-3xl">🎖️</span>
          <div>
            <p className="font-semibold text-gray-900 dark:text-white">Achievements</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">{myAchievements.length} earned</p>
          </div>
        </Link>
        <Link to="/friends" className="card p-4 hover:shadow-md transition-shadow flex items-center gap-3">
          <span className="text-3xl">👥</span>
          <div>
            <p className="font-semibold text-gray-900 dark:text-white">Friends</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">Connect with players</p>
          </div>
        </Link>
      </div>
    </div>
  )
}
