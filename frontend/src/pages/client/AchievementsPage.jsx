import React, { useState, useEffect } from 'react'
import { achievementsApi } from '../../services/achievements.api'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import EmptyState from '../../components/common/EmptyState'

export default function AchievementsPage() {
  const [allAchievements, setAllAchievements] = useState([])
  const [myAchievements, setMyAchievements] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      achievementsApi.listAll().catch(() => []),
      achievementsApi.listMine().catch(() => []),
    ]).then(([all, mine]) => {
      setAllAchievements(Array.isArray(all) ? all : all?.items || [])
      setMyAchievements(Array.isArray(mine) ? mine : mine?.items || [])
    }).finally(() => setLoading(false))
  }, [])

  const earnedIds = new Set(myAchievements.map(ua => ua.achievement_id || ua.achievement?.id || ua.id))
  const earnedMap = {}
  myAchievements.forEach(ua => {
    const id = ua.achievement_id || ua.achievement?.id
    if (id) earnedMap[id] = ua.earned_at
  })

  if (loading) return <div className="p-8 flex justify-center"><LoadingSpinner size="lg" /></div>

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Achievements</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          {myAchievements.length} / {allAchievements.length} earned
        </p>
      </div>

      {/* Progress bar */}
      <div className="card p-4 mb-6">
        <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
          <span>Progress</span>
          <span>{allAchievements.length > 0 ? Math.round((myAchievements.length / allAchievements.length) * 100) : 0}%</span>
        </div>
        <div className="h-3 bg-gray-200 dark:bg-slate-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-primary-500 to-purple-500 rounded-full transition-all"
            style={{ width: allAchievements.length > 0 ? `${(myAchievements.length / allAchievements.length) * 100}%` : '0%' }}
          />
        </div>
      </div>

      {allAchievements.length === 0 ? (
        <EmptyState icon="🏆" title="No achievements yet" description="Achievements will appear here as they're added to the system" />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {allAchievements.map(ach => {
            const earned = earnedIds.has(ach.id)
            const earnedAt = earnedMap[ach.id]
            return (
              <div
                key={ach.id}
                className={`card p-4 transition-all ${
                  earned
                    ? 'ring-2 ring-primary-400 dark:ring-primary-500 bg-primary-50 dark:bg-primary-900/20'
                    : 'opacity-60 grayscale'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="text-3xl">{ach.icon || '🏆'}</div>
                  <div className="flex-1">
                    <h3 className={`font-bold ${earned ? 'text-primary-700 dark:text-primary-300' : 'text-gray-700 dark:text-gray-400'}`}>
                      {ach.name}
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{ach.description}</p>
                    {earned && earnedAt && (
                      <p className="text-xs text-primary-500 mt-1">
                        Earned: {new Date(earnedAt).toLocaleDateString()}
                      </p>
                    )}
                    {!earned && (
                      <p className="text-xs text-gray-400 mt-1">Not earned yet</p>
                    )}
                  </div>
                  {earned && (
                    <div className="text-xl">✅</div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
