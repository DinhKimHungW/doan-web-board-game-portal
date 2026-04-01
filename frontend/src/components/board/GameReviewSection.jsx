import React, { useState } from 'react'
import StarRating from '../common/StarRating'
import Button from '../common/Button'
import { gamesApi } from '../../services/games.api'
import { formatScore } from '../../utils/formatters'

export default function GameReviewSection({ gameSlug, score, result, onPlayAgain, onQuit }) {
  const [rating, setRating] = useState(5)
  const [comment, setComment] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  const resultConfig = {
    WIN: { emoji: '🏆', color: 'text-yellow-500', label: 'You Won!' },
    LOSE: { emoji: '💀', color: 'text-red-500', label: 'Game Over' },
    DRAW: { emoji: '🤝', color: 'text-blue-500', label: 'Draw!' },
  }
  const config = resultConfig[result] || { emoji: '🎮', color: 'text-primary-500', label: 'Game Finished' }

  const handleSubmitReview = async () => {
    setLoading(true)
    try {
      await gamesApi.addReview(gameSlug, { rating, comment })
      setSubmitted(true)
    } catch {}
    setLoading(false)
  }

  return (
    <div className="text-center space-y-6">
      {/* Result */}
      <div>
        <div className="text-6xl mb-2">{config.emoji}</div>
        <h3 className={`text-3xl font-bold ${config.color}`}>{config.label}</h3>
        <p className="text-2xl font-bold text-gray-700 dark:text-gray-300 mt-2">
          Score: <span className="text-primary-500">{formatScore(score)}</span>
        </p>
      </div>

      {/* Action buttons */}
      <div className="flex gap-3 justify-center">
        <Button onClick={onPlayAgain} variant="primary">🔄 Play Again</Button>
        <Button onClick={onQuit} variant="secondary">🏠 Home</Button>
      </div>

      {/* Review form */}
      {!submitted ? (
        <div className="card p-4 text-left">
          <h4 className="font-semibold text-gray-800 dark:text-white mb-3">Rate this game</h4>
          <div className="flex items-center gap-3 mb-3">
            <StarRating value={rating} onChange={setRating} size="lg" />
            <span className="text-sm text-gray-500">({rating}/5)</span>
          </div>
          <textarea
            value={comment}
            onChange={e => setComment(e.target.value)}
            placeholder="Leave a comment (optional)..."
            rows={2}
            className="input-field resize-none mb-3"
          />
          <Button onClick={handleSubmitReview} loading={loading} size="sm">
            Submit Review
          </Button>
        </div>
      ) : (
        <div className="card p-4 text-center">
          <p className="text-green-600 dark:text-green-400 font-medium">✅ Thanks for your review!</p>
        </div>
      )}
    </div>
  )
}
