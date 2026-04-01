import React from 'react'

export default function Caro5Board({ presentation, onCellClick }) {
  if (!presentation) return null
  const cols = presentation[0]?.length || 12
  return (
    <div className="overflow-auto max-w-full p-2">
      <div className="inline-grid gap-px" style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}>
        {presentation.map((row, r) =>
          row.map((cell, c) => (
            <button
              key={`${r}-${c}`}
              onClick={() => onCellClick(r, c)}
              className={`w-7 h-7 text-xs font-bold flex items-center justify-center transition-all border
                ${cell.cursor ? 'border-primary-400 ring-1 ring-primary-400/50 scale-110 z-10 relative' : 'border-slate-600'}
                ${cell.color === 'win' ? 'bg-yellow-400 text-white' :
                  cell.color === 'blue' ? 'bg-blue-500 text-white' :
                  cell.color === 'red' ? 'bg-red-500 text-white' :
                  'bg-slate-700 hover:bg-slate-600'}
              `}
            >
              {cell.value || (cell.cursor ? '·' : '')}
            </button>
          ))
        )}
      </div>
    </div>
  )
}
