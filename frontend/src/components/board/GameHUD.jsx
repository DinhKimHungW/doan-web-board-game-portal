import React from 'react'
import GameControls from './GameControls'
import { formatScore, formatTime } from '../../utils/formatters'

const GAME_ICONS = {
  'tic-tac-toe': '⭕', 'tic_tac_toe': '⭕', caro4: '⊞', caro5: '⊞', snake: '🐍', match3: '💎', memory: '🃏', draw: '🎨'
}

export default function GameHUD({
  gameName, gameSlug, score, timer, timerDirection = 'up',
  status, currentPlayer, gameOver,
  onSave, onLoad, onNewGame, onQuit,
  onLeft, onRight, onUp, onDown, onEnter, onBack, onHint,
  isSaving, isLoading,
}) {
  const icon = GAME_ICONS[gameSlug] || '🎮'

  return (
    <div className="flex flex-col gap-4 h-full">
      {/* Game Title */}
      <div className="card p-4 text-center">
        <div className="text-4xl mb-1">{icon}</div>
        <h2 className="font-bold text-lg text-gray-900 dark:text-white">{gameName || 'Game'}</h2>
        {currentPlayer && !gameOver && (
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Player: <span className={`font-bold ${currentPlayer === 'X' ? 'text-blue-500' : 'text-red-500'}`}>{currentPlayer}</span>
          </p>
        )}
      </div>

      {/* Score & Timer */}
      <div className="grid grid-cols-2 gap-3">
        <div className="card p-3 text-center">
          <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">Score</p>
          <p className="text-2xl font-bold text-primary-500">{formatScore(score)}</p>
        </div>
        {timer !== undefined && (
          <div className="card p-3 text-center">
            <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">Time</p>
            <p className={`text-2xl font-bold ${timer < 30 && timerDirection==='down' ? 'text-red-500' : 'text-green-500'}`}>
              {formatTime(timer)}
            </p>
          </div>
        )}
      </div>

      {/* Status */}
      {status && (
        <div className={`card p-3 text-center text-sm font-medium ${gameOver ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300' : 'text-gray-600 dark:text-gray-400'}`}>
          {status}
        </div>
      )}

      {/* Save/Load */}
      <div className="grid grid-cols-2 gap-2">
        <button
          onClick={onSave}
          disabled={isSaving || gameOver}
          className="btn btn-secondary text-sm py-2 disabled:opacity-40"
        >
          {isSaving ? '⏳' : '💾'} Save
        </button>
        <button
          onClick={onLoad}
          disabled={isLoading}
          className="btn btn-secondary text-sm py-2 disabled:opacity-40"
        >
          {isLoading ? '⏳' : '📂'} Load
        </button>
      </div>

      {/* New Game / Quit */}
      <div className="grid grid-cols-2 gap-2">
        <button onClick={onNewGame} className="btn btn-primary text-sm py-2">
          🔄 New
        </button>
        <button onClick={onQuit} className="btn btn-danger text-sm py-2">
          🚪 Quit
        </button>
      </div>

      {/* The 5 Control Buttons */}
      <GameControls
        onLeft={onLeft}
        onRight={onRight}
        onUp={onUp}
        onDown={onDown}
        onEnter={onEnter}
        onBack={onBack}
        onHint={onHint}
        disabled={gameOver}
      />
    </div>
  )
}
