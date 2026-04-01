import React, { useEffect } from 'react'

// Shared generic game board renderer
export default function GameBoard({ presentation, onCellClick, onKeyAction, gameSlug }) {
  useEffect(() => {
    const handleKey = (e) => {
      if (!onKeyAction) return
      switch (e.key) {
        case 'ArrowLeft':  e.preventDefault(); onKeyAction('LEFT'); break
        case 'ArrowRight': e.preventDefault(); onKeyAction('RIGHT'); break
        case 'ArrowUp':    e.preventDefault(); onKeyAction('UP'); break
        case 'ArrowDown':  e.preventDefault(); onKeyAction('DOWN'); break
        case 'Enter':      e.preventDefault(); onKeyAction('ENTER'); break
        case 'Escape':     e.preventDefault(); onKeyAction('BACK'); break
        default: break
      }
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [onKeyAction])

  if (!presentation || !presentation.length) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-400">
        <p>Loading board...</p>
      </div>
    )
  }

  const rows = presentation.length
  const cols = presentation[0]?.length || 1

  return (
    <div
      className="inline-grid gap-1 p-4 bg-game-bg rounded-2xl shadow-inner"
      style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}
    >
      {presentation.map((row, r) =>
        row.map((cell, c) => (
          <button
            key={`${r}-${c}`}
            onClick={() => onCellClick && onCellClick(r, c)}
            style={cell.color?.startsWith('#') ? { backgroundColor: cell.color } : undefined}
            className={`game-cell aspect-square min-w-[1.5rem] text-xs font-bold transition-all
              ${!cell.color?.startsWith('#') ? getCellClass(cell) : ''}
              ${cell.cursor ? 'ring-2 ring-primary-400 scale-110 z-10 relative' : ''}
            `}
          >
            {cell.value || (cell.cursor ? '·' : '')}
          </button>
        ))
      )}
    </div>
  )
}

function getCellClass(cell) {
  const colorMap = {
    win: 'bg-yellow-400 text-white',
    blue: 'bg-blue-500 text-white',
    red: 'bg-red-500 text-white',
    head: 'bg-green-400',
    snake: 'bg-green-600',
    food: 'bg-red-500',
    matched: 'bg-green-500 text-white text-2xl',
    flipped: 'bg-blue-500 text-white text-2xl',
    hidden: 'bg-purple-700 hover:bg-purple-600',
    empty: 'bg-game-cell hover:bg-game-hover',
  }
  return colorMap[cell.color] || 'bg-game-cell hover:bg-game-hover'
}
