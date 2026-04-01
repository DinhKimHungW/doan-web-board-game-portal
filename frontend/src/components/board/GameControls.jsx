import React from 'react'

export default function GameControls({ onLeft, onRight, onUp, onDown, onEnter, onBack, onHint, disabled = false }) {
  const btnBase = 'flex items-center justify-center rounded-xl font-bold transition-all duration-150 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed shadow-md select-none'

  return (
    <div className="flex flex-col items-center gap-3 p-4 bg-slate-800 dark:bg-slate-900 rounded-2xl border border-slate-700">
      <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Controls</p>

      {/* D-Pad */}
      <div className="grid grid-cols-3 gap-1.5 mb-1">
        {/* Up */}
        <div />
        <button
          onClick={onUp}
          disabled={disabled}
          className={`${btnBase} w-12 h-12 bg-slate-700 hover:bg-slate-600 text-white text-lg`}
          title="Move Up"
        >↑</button>
        <div />

        {/* Left - ENTER - Right row */}
        <button
          onClick={onLeft}
          disabled={disabled}
          className={`${btnBase} w-12 h-12 bg-slate-700 hover:bg-slate-600 text-white text-lg`}
          title="Move Left"
        >←</button>
        <button
          onClick={onEnter}
          disabled={disabled}
          className={`${btnBase} w-12 h-12 bg-primary-600 hover:bg-primary-500 text-white text-base`}
          title="Confirm / Place"
        >⏎</button>
        <button
          onClick={onRight}
          disabled={disabled}
          className={`${btnBase} w-12 h-12 bg-slate-700 hover:bg-slate-600 text-white text-lg`}
          title="Move Right"
        >→</button>

        {/* Down */}
        <div />
        <button
          onClick={onDown}
          disabled={disabled}
          className={`${btnBase} w-12 h-12 bg-slate-700 hover:bg-slate-600 text-white text-lg`}
          title="Move Down"
        >↓</button>
        <div />
      </div>

      {/* Action buttons */}
      <div className="flex gap-3 w-full">
        <button
          onClick={onBack}
          disabled={disabled}
          className={`${btnBase} flex-1 h-11 bg-red-700 hover:bg-red-600 text-white text-sm`}
          title="Back / Cancel"
        >
          <span className="mr-1">✕</span> Back
        </button>
        <button
          onClick={onHint}
          disabled={disabled}
          className={`${btnBase} flex-1 h-11 bg-yellow-600 hover:bg-yellow-500 text-white text-sm`}
          title="Hint / Help"
        >
          <span className="mr-1">💡</span> Hint
        </button>
      </div>

      {/* Legend */}
      <div className="text-xs text-slate-500 text-center leading-relaxed">
        <span className="block">Arrow keys to move</span>
        <span className="block">Enter to confirm</span>
        <span className="block">Esc to go back</span>
      </div>
    </div>
  )
}
