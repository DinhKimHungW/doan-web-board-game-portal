import React from 'react'

const GEM_COLORS = {
  red: 'bg-red-500 hover:bg-red-400',
  blue: 'bg-blue-500 hover:bg-blue-400',
  green: 'bg-emerald-500 hover:bg-emerald-400',
  yellow: 'bg-yellow-400 hover:bg-yellow-300',
  purple: 'bg-purple-500 hover:bg-purple-400',
  orange: 'bg-orange-500 hover:bg-orange-400',
}

const GEM_EMOJI = { red: '🔴', blue: '🔵', green: '🟢', yellow: '🟡', purple: '🟣', orange: '🟠' }

export default function Match3Board({ presentation, onCellClick }) {
  if (!presentation) return null
  const cols = presentation[0]?.length || 8
  return (
    <div className="overflow-auto max-w-full p-2">
      <div className="inline-grid gap-1" style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}>
        {presentation.map((row, r) =>
          row.map((cell, c) => (
            <button
              key={`${r}-${c}`}
              onClick={() => onCellClick(r, c)}
              className={`w-10 h-10 rounded-lg text-xl flex items-center justify-center transition-all duration-150 shadow-md
                ${GEM_COLORS[cell.color] || 'bg-slate-700'}
                ${cell.selected ? 'ring-4 ring-white scale-110 z-10 relative' : ''}
                ${cell.cursor && !cell.selected ? 'ring-2 ring-yellow-300' : ''}
              `}
            >
              {GEM_EMOJI[cell.color] || ''}
            </button>
          ))
        )}
      </div>
    </div>
  )
}
