import React from 'react'
import { Outlet } from 'react-router-dom'
import { useTheme } from '../hooks/useTheme'

export default function PublicLayout() {
  const { theme, toggleTheme } = useTheme()
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex flex-col">
      <div className="absolute top-4 right-4">
        <button
          onClick={toggleTheme}
          className="p-2 rounded-lg text-gray-300 hover:bg-white/10 transition-colors"
          title="Toggle theme"
        >
          {theme === 'dark' ? '☀️' : '🌙'}
        </button>
      </div>
      <div className="flex-1 flex items-center justify-center p-4">
        <Outlet />
      </div>
    </div>
  )
}
