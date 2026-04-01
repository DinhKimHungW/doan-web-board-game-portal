import React from 'react'

export default function SnakeBoard({ presentation, onCellClick }) {
  if (!presentation) return null
  const cols = presentation[0]?.length || 16
  return (
    <div className="overflow-auto max-w-full p-2">
      <div className="inline-grid gap-px bg-slate-900 border border-slate-600 rounded" style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}>
        {presentation.map((row, r) =>
          row.map((cell, c) => (
            <div
              key={`${r}-${c}`}
              className={`w-6 h-6 flex items-center justify-center text-xs rounded-sm transition-colors
                ${cell.color === 'head' ? 'bg-green-400' :
                  cell.color === 'snake' ? 'bg-green-600' :
                  cell.color === 'food' ? 'bg-red-500' :
                  'bg-slate-800'}
              `}
            >
              {cell.color === 'food' ? '●' : cell.color === 'head' ? '■' : ''}
            </div>
          ))
        )}
      </div>
    </div>
  )
}
