import React from 'react'
import { getInitials } from '../../utils/formatters'

// Supports both: <Avatar user={userObj} /> and <Avatar name="John" src="..." />
export default function Avatar({ user, name, src, size = 'md', className = '' }) {
  const sizes = {
    xs: 'w-6 h-6 text-xs',
    sm: 'w-8 h-8 text-sm',
    md: 'w-10 h-10 text-base',
    lg: 'w-14 h-14 text-xl',
    xl: 'w-20 h-20 text-2xl',
  }

  const displayName = name || user?.name || user?.email || '?'
  const avatarUrl = src || user?.avatar_url || user?.avatarUrl

  if (avatarUrl) {
    return (
      <img
        src={avatarUrl}
        alt={displayName}
        className={`${sizes[size]} rounded-full object-cover ring-2 ring-primary-500/30 flex-shrink-0 ${className}`}
      />
    )
  }

  const colors = [
    'bg-purple-500', 'bg-blue-500', 'bg-green-500',
    'bg-yellow-500', 'bg-pink-500', 'bg-indigo-500'
  ]
  const colorIndex = (displayName?.charCodeAt(0) || 0) % colors.length

  return (
    <div className={`${sizes[size]} ${colors[colorIndex]} rounded-full flex items-center justify-center font-bold text-white flex-shrink-0 ${className}`}>
      {getInitials(displayName)}
    </div>
  )
}
