import React from 'react'
import Modal from '../common/Modal'
import Button from '../common/Button'

const INSTRUCTIONS = {
  'tic-tac-toe': {
    title: 'Tic Tac Toe',
    rules: [
      'Players alternate placing X and O on a 3×3 grid',
      'First to get 3 in a row (horizontal, vertical, or diagonal) wins',
      'Use arrow keys or click to move cursor, then ENTER or click to place',
      'If all cells are filled with no winner, it\'s a draw',
    ]
  },
  caro4: {
    title: 'Caro 4',
    rules: [
      'Players alternate placing X and O on an 8×8 grid',
      'First to get 4 in a row wins',
      'Use arrow keys or click to move cursor, ENTER to place',
    ]
  },
  caro5: {
    title: 'Caro 5 (Gomoku)',
    rules: [
      'Players alternate placing X and O on a 12×12 grid',
      'First to get 5 in a row wins',
      'Use arrow keys or click to move cursor, ENTER to place',
    ]
  },
  snake: {
    title: 'Snake',
    rules: [
      'Control the snake to eat food (red dot)',
      'Each food eaten grows the snake and adds 10 points',
      'Avoid hitting walls or your own body',
      'Use arrow keys or Left/Right controls to steer',
    ]
  },
  match3: {
    title: 'Match 3',
    rules: [
      'Click a gem, then click an adjacent gem to swap them',
      'Creating 3 or more in a row removes those gems and scores points',
      'Gems fall down to fill gaps and new ones appear at the top',
      'Try to chain combos for maximum score!',
    ]
  },
  memory: {
    title: 'Memory Cards',
    rules: [
      'Click cards to flip them and reveal their emoji',
      'If two flipped cards match, they stay revealed',
      'If they don\'t match, they flip back after a moment',
      'Match all pairs to win. Fewer attempts = better score!',
    ]
  },
  draw: {
    title: 'Free Draw',
    rules: [
      'Click on any cell to paint it with the selected color',
      'Choose colors from the palette below the grid',
      'Use Left/Right controls to cycle through colors',
      'Save your artwork with the Save button!',
    ]
  },
}

export default function GameInstructionsModal({ isOpen, onClose, gameSlug }) {
  const info = INSTRUCTIONS[gameSlug] || { title: 'How to Play', rules: ['Click cells to interact with the board', 'Use arrow keys for keyboard navigation'] }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`How to Play: ${info.title}`} size="md">
      <ul className="space-y-3 mb-6">
        {info.rules.map((rule, i) => (
          <li key={i} className="flex items-start gap-3">
            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 flex items-center justify-center text-sm font-bold">{i+1}</span>
            <span className="text-gray-700 dark:text-gray-300">{rule}</span>
          </li>
        ))}
      </ul>
      <div className="bg-slate-50 dark:bg-slate-700/50 rounded-lg p-4 mb-4">
        <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Controls:</p>
        <div className="grid grid-cols-2 gap-1 text-xs text-gray-600 dark:text-gray-400">
          <span>← → ↑ ↓</span><span>Move cursor</span>
          <span>Enter / ⏎</span><span>Confirm action</span>
          <span>Escape / ✕</span><span>Go back</span>
          <span>💡 Hint</span><span>Get a hint</span>
        </div>
      </div>
      <Button onClick={onClose} className="w-full">Got it! Let's Play</Button>
    </Modal>
  )
}
