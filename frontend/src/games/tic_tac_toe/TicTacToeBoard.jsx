import React from 'react'

export default function TicTacToeBoard({ presentation, onCellClick, cursor }) {
  if (!presentation) return null
  return (
    <div className="inline-grid gap-2 p-4" style={{ gridTemplateColumns: `repeat(${presentation[0]?.length || 3}, 1fr)` }}>
      {presentation.map((row, r) =>
        row.map((cell, c) => (
          <button
            key={`${r}-${c}`}
            onClick={() => onCellClick(r, c)}
            className={`w-20 h-20 rounded-xl text-4xl font-bold flex items-center justify-center transition-all duration-150 border-2 shadow-md
              ${cell.cursor ? 'border-primary-400 ring-2 ring-primary-400/50 scale-105' : 'border-transparent'}
              ${cell.color === 'win' ? 'bg-yellow-400 dark:bg-yellow-500 text-white' :
                cell.color === 'blue' ? 'bg-blue-500 text-white' :
                cell.color === 'red' ? 'bg-red-500 text-white' :
                'bg-game-cell hover:bg-game-hover text-transparent hover:text-gray-400 cursor-pointer'}
            `}
          >
            {cell.value || (cell.cursor ? '·' : '')}
          </button>
        ))
      )}
    </div>
  )
}
