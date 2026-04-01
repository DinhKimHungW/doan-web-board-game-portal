import React from 'react'
import Button from './Button'

export default function ErrorState({ title = 'Something went wrong', message, onRetry }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="text-6xl mb-4">⚠️</div>
      <h3 className="text-xl font-semibold text-red-600 dark:text-red-400 mb-2">{title}</h3>
      {message && <p className="text-gray-500 dark:text-gray-400 max-w-sm mb-4">{message}</p>}
      {onRetry && <Button onClick={onRetry} variant="secondary">Try Again</Button>}
    </div>
  )
}
