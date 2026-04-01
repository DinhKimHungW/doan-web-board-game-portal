import React from 'react'

export default function EmptyState({ icon = '📭', title = 'Nothing here yet', description = '', action }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="text-6xl mb-4">{icon}</div>
      <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">{title}</h3>
      {description && <p className="text-gray-500 dark:text-gray-500 max-w-sm mb-4">{description}</p>}
      {action}
    </div>
  )
}
