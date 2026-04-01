import React from 'react'

export default function DrawBoard({ presentation, onCellClick, gameState }) {
  if (!presentation) return null
  const cols = presentation[0]?.length || 20

  return (
    <div className="flex flex-col items-center gap-3">
      {/* Color Palette */}
      {gameState?.palette && (
        <div className="flex gap-2 flex-wrap justify-center">
          {gameState.palette.map(color => (
            <button
              key={color}
              onClick={() => {}}
              style={{ backgroundColor: color }}
              className={`w-7 h-7 rounded border-2 transition-transform ${gameState.selectedColor === color ? 'border-white scale-125' : 'border-transparent'}`}
            />
          ))}
        </div>
      )}
      {/* Grid */}
      <div className="overflow-auto max-w-full">
        <div className="inline-grid gap-px bg-slate-700" style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}>
          {presentation.map((row, r) =>
            row.map((cell, c) => (
              <div
                key={`${r}-${c}`}
                onClick={() => onCellClick(r, c)}
                style={{ backgroundColor: cell.color }}
                className={`w-5 h-5 cursor-crosshair transition-all
                  ${cell.cursor ? 'ring-1 ring-white ring-inset' : ''}
                `}
              />
            ))
          )}
        </div>
      </div>
    </div>
  )
}
