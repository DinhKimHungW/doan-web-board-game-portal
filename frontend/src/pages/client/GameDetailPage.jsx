import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { gamesApi } from '../../services/games.api'
import { useAuth } from '../../hooks/useAuth'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import StarRating from '../../components/common/StarRating'
import Pagination from '../../components/common/Pagination'
import Avatar from '../../components/common/Avatar'
import Modal from '../../components/common/Modal'

const GAME_META = {
  'tic-tac-toe': { icon: '⭕', color: 'from-blue-500 to-purple-600' },
  caro4: { icon: '⊞', color: 'from-green-500 to-teal-600' },
  caro5: { icon: '⊟', color: 'from-yellow-500 to-orange-600' },
  snake: { icon: '🐍', color: 'from-green-600 to-emerald-700' },
  match3: { icon: '💎', color: 'from-pink-500 to-rose-600' },
  memory: { icon: '🃏', color: 'from-purple-500 to-indigo-600' },
  draw: { icon: '🎨', color: 'from-orange-500 to-red-600' },
}

export default function GameDetailPage() {
  const { slug } = useParams()
  const { user } = useAuth()
  const [game, setGame] = useState(null)
  const [reviews, setReviews] = useState([])
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1 })
  const [loading, setLoading] = useState(true)
  const [showReviewModal, setShowReviewModal] = useState(false)
  const [myRating, setMyRating] = useState(0)
  const [myComment, setMyComment] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [myReview, setMyReview] = useState(null)

  const loadGame = async () => {
    try {
      const g = await gamesApi.getBySlug(slug)
      setGame(g)
    } catch { /* ignore */ }
  }

  const loadReviews = async (page = 1) => {
    try {
      const res = await gamesApi.getReviews(slug, { page, limit: 5 })
      // API returns {reviews: [...], my_review, pagination} or array
      const items = Array.isArray(res) ? res : (res?.reviews || res?.items || [])
      setReviews(Array.isArray(items) ? items : [])
      const pag = res?.pagination || {}
      setPagination({ page: pag.page || 1, totalPages: pag.totalPages || 1 })
      const mine = res?.my_review || items.find(r => r.user_id === user?.id)
      if (mine) { setMyReview(mine); setMyRating(mine.rating); setMyComment(mine.comment || '') }
    } catch { /* ignore */ }
  }

  useEffect(() => {
    setLoading(true)
    Promise.all([loadGame(), loadReviews()]).finally(() => setLoading(false))
  }, [slug])

  const handleSubmitReview = async (e) => {
    e.preventDefault()
    if (!myRating) return
    setSubmitting(true)
    try {
      if (myReview) {
        await gamesApi.updateReview(slug, myReview.id, { rating: myRating, comment: myComment })
      } else {
        await gamesApi.addReview(slug, { rating: myRating, comment: myComment })
      }
      setShowReviewModal(false)
      await loadReviews()
      await loadGame()
    } catch { /* ignore */ }
    setSubmitting(false)
  }

  if (loading) return <div className="p-8 flex justify-center"><LoadingSpinner size="lg" /></div>
  if (!game) return <div className="p-8 text-center text-gray-400">Game not found</div>

  const meta = GAME_META[slug] || { icon: '🎮', color: 'from-gray-500 to-gray-700' }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Hero */}
      <div className={`rounded-2xl bg-gradient-to-br ${meta.color} p-8 mb-8 text-white flex items-center gap-6`}>
        <div className="text-7xl">{meta.icon}</div>
        <div className="flex-1">
          <h1 className="text-3xl font-bold">{game.name}</h1>
          <p className="mt-2 text-white/80">{game.description}</p>
          <div className="flex items-center gap-4 mt-4">
            <StarRating value={parseFloat(game.avg_rating) || 0} readonly />
            <span className="text-sm text-white/70">
              {game.avg_rating ? parseFloat(game.avg_rating).toFixed(1) : '0.0'} / 5
              {game.review_count ? ` · ${game.review_count} reviews` : ''}
            </span>
          </div>
        </div>
        <Link
          to={`/games/${slug}/play`}
          className={`btn bg-white text-gray-900 hover:bg-gray-100 font-bold px-8 py-3 ${!game.is_enabled ? 'opacity-50 pointer-events-none' : ''}`}
        >
          {game.is_enabled ? 'Play Now' : 'Disabled'}
        </Link>
      </div>

      {/* Game Info */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="card p-4 text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">Board Size</p>
          <p className="text-xl font-bold text-gray-900 dark:text-white mt-1">
            {game.default_rows}×{game.default_cols}
          </p>
        </div>
        <div className="card p-4 text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">Time Limit</p>
          <p className="text-xl font-bold text-gray-900 dark:text-white mt-1">
            {game.default_time_limit ? `${Math.floor(game.default_time_limit / 60)}min` : 'No limit'}
          </p>
        </div>
        <div className="card p-4 text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">Type</p>
          <p className="text-xl font-bold text-gray-900 dark:text-white mt-1 capitalize">{game.type || 'Game'}</p>
        </div>
      </div>

      {/* Reviews */}
      <div className="card p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Reviews</h2>
          <button
            onClick={() => setShowReviewModal(true)}
            className="btn btn-primary text-sm"
          >
            {myReview ? 'Edit Review' : 'Write Review'}
          </button>
        </div>

        {reviews.length === 0 ? (
          <p className="text-center text-gray-400 py-8">No reviews yet. Be the first!</p>
        ) : (
          <div className="space-y-4">
            {reviews.map(r => (
              <div key={r.id} className="border-b border-gray-200 dark:border-gray-700 pb-4 last:border-0">
                <div className="flex items-center gap-3 mb-2">
                  <Avatar name={r.user_name || r.user?.name || 'User'} src={r.user_avatar || r.user?.avatar_url} size="sm" />
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">{r.user_name || r.user?.name || 'User'}</p>
                    <StarRating value={r.rating} readonly size="sm" />
                  </div>
                  {r.user_id === user?.id && (
                    <span className="ml-auto text-xs bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 px-2 py-0.5 rounded-full">Your review</span>
                  )}
                </div>
                {r.comment && <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{r.comment}</p>}
              </div>
            ))}
          </div>
        )}

        {pagination.totalPages > 1 && (
          <div className="mt-4">
            <Pagination page={pagination.page} totalPages={pagination.totalPages} onPageChange={(p) => loadReviews(p)} />
          </div>
        )}
      </div>

      {/* Review Modal */}
      <Modal isOpen={showReviewModal} onClose={() => setShowReviewModal(false)} title={myReview ? 'Edit Review' : 'Write a Review'}>
        <form onSubmit={handleSubmitReview} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Your Rating</label>
            <StarRating value={myRating} onChange={setMyRating} size="lg" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Comment (optional)</label>
            <textarea
              value={myComment}
              onChange={e => setMyComment(e.target.value)}
              rows={3}
              className="input w-full resize-none"
              placeholder="Share your thoughts..."
            />
          </div>
          <div className="flex justify-end gap-3">
            <button type="button" onClick={() => setShowReviewModal(false)} className="btn btn-secondary">Cancel</button>
            <button type="submit" disabled={!myRating || submitting} className="btn btn-primary disabled:opacity-50">
              {submitting ? 'Saving...' : 'Submit'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
