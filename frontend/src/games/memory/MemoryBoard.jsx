import React from 'react'

export default function MemoryBoard({ presentation, onCellClick }) {
  if (!presentation) return null
  const cols = presentation[0]?.length || 4
  return (
    <div className="overflow-auto max-w-full p-2">
      <div className="inline-grid gap-2" style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}>
        {presentation.map((row, r) =>
          row.map((cell, c) => (
            <button
              key={`${r}-${c}`}
              onClick={() => onCellClick(r, c)}
              className={`w-16 h-16 rounded-xl text-3xl flex items-center justify-center transition-all duration-200 shadow-md font-bold border-2
                ${cell.cursor ? 'border-yellow-400 scale-105' : 'border-transparent'}
                ${cell.color === 'matched' ? 'bg-green-500 text-white' :
                  cell.color === 'flipped' ? 'bg-blue-500 text-white scale-105' :
                  'bg-purple-700 hover:bg-purple-600 text-purple-500'}
              `}
            >
              {cell.value}
            </button>
          ))
        )}
      </div>
    </div>
  )
}
