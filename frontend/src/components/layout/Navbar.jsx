import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { useTheme } from '../../hooks/useTheme'
import Avatar from '../common/Avatar'

export default function Navbar() {
  const { user, logout } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  return (
    <nav className="sticky top-0 z-40 bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-slate-700 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <span className="text-2xl">🎮</span>
            <span className="font-bold text-xl text-primary-600 dark:text-primary-400">GamePortal</span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-6">
            <Link to="/" className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">Home</Link>
            <Link to="/games" className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">Games</Link>
            <Link to="/rankings" className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">Rankings</Link>
            <Link to="/achievements" className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">Achievements</Link>
            {user?.role === 'ADMIN' && (
              <Link to="/admin" className="text-sm font-medium text-yellow-600 dark:text-yellow-400 hover:text-yellow-700 transition-colors">Admin</Link>
            )}
          </div>

          {/* Right section */}
          <div className="flex items-center gap-3">
            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
              title="Toggle theme"
            >
              {theme === 'dark' ? '☀️' : '🌙'}
            </button>

            {/* User menu */}
            <div className="relative">
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="flex items-center gap-2 p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
              >
                <Avatar user={user} size="sm" />
                <span className="hidden sm:block text-sm font-medium text-gray-700 dark:text-gray-300">
                  {user?.name || 'User'}
                </span>
                <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {menuOpen && (
                <div className="absolute right-0 mt-2 w-48 card shadow-lg py-1 z-50">
                  <Link to="/profile" className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700" onClick={() => setMenuOpen(false)}>Profile</Link>
                  <Link to="/friends" className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700" onClick={() => setMenuOpen(false)}>Friends</Link>
                  <Link to="/messages" className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700" onClick={() => setMenuOpen(false)}>Messages</Link>
                  <Link to="/settings" className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700" onClick={() => setMenuOpen(false)}>Settings</Link>
                  <hr className="my-1 border-gray-200 dark:border-slate-600" />
                  <button onClick={handleLogout} className="w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-slate-700">
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Click outside to close */}
      {menuOpen && <div className="fixed inset-0 z-30" onClick={() => setMenuOpen(false)} />}
    </nav>
  )
}
