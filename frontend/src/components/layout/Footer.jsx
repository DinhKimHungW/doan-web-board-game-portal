import React from 'react'

export default function Footer() {
  return (
    <footer className="bg-white dark:bg-slate-900 border-t border-gray-200 dark:border-slate-700 py-4 mt-auto">
      <div className="max-w-7xl mx-auto px-4 text-center text-sm text-gray-500 dark:text-gray-400">
        <span>🎮 GamePortal &copy; {new Date().getFullYear()} — Built with React &amp; TailwindCSS</span>
      </div>
    </footer>
  )
}
