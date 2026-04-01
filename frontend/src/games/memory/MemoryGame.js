import { GameEngine } from '../GameEngine'

const EMOJIS = ['🐶','🐱','🐭','🐹','🐰','🦊','🐻','🐼','🐨','🐯','🦁','🐮','🐸','🐙','🦋','🌸']

function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length-1; i > 0; i--) {
    const j = Math.floor(Math.random()*(i+1));
    [a[i],a[j]] = [a[j],a[i]]
  }
  return a
}

export class MemoryGame extends GameEngine {
  createInitialState(config = {}) {
    const rows = config.rows || 4, cols = config.cols || 4
    const total = rows * cols
    const pairCount = total / 2
    const emojis = EMOJIS.slice(0, pairCount)
    const cards = shuffle([...emojis, ...emojis]).map((emoji, i) => ({ id: i, emoji, flipped: false, matched: false }))
    return {
      rows, cols, cards, flipped: [], matched: [], attempts: 0, score: 0, gameOver: false,
      cursor: { row: 0, col: 0 },
    }
  }

  applyUserAction(state, action) {
    const s = { ...state, cards: state.cards.map(c => ({ ...c })), flipped: [...state.flipped], matched: [...state.matched] }
    if (action.type === 'FLIP') {
      const idx = action.payload.index
      const card = s.cards[idx]
      if (!card || card.flipped || card.matched || s.flipped.length >= 2) return state
      s.cards[idx] = { ...card, flipped: true }
      s.flipped = [...s.flipped, idx]
      if (s.flipped.length === 2) {
        s.attempts++
        const [i1, i2] = s.flipped
        if (s.cards[i1].emoji === s.cards[i2].emoji) {
          s.cards[i1] = { ...s.cards[i1], matched: true }
          s.cards[i2] = { ...s.cards[i2], matched: true }
          s.matched = [...s.matched, i1, i2]
          s.score += 20
          s.flipped = []
          if (s.matched.length === s.cards.length) s.gameOver = true
        }
        // Non-matching: keep flipped=2 so GamePlayPage can reset after delay
      }
    } else if (action.type === 'UNFLIP') {
      if (s.flipped.length === 2) {
        const [i1, i2] = s.flipped
        s.cards[i1] = { ...s.cards[i1], flipped: false }
        s.cards[i2] = { ...s.cards[i2], flipped: false }
        s.flipped = []
      }
    } else if (action.type === 'CURSOR') {
      s.cursor = { row: Math.max(0,Math.min(s.rows-1,action.payload.row)), col: Math.max(0,Math.min(s.cols-1,action.payload.col)) }
    } else if (action.type === 'RESET') {
      return this.createInitialState({ rows: s.rows, cols: s.cols })
    }
    return s
  }

  isGameOver(state) {
    return { over: state.gameOver, result: state.gameOver ? 'WIN' : null }
  }

  calculateScore(state) { return state.score }

  getHint(state) {
    const unmatched = state.cards.filter(c => !c.matched)
    if (unmatched.length < 2) return 'Almost done!'
    return `${unmatched.length} cards remaining, ${state.attempts} attempts so far`
  }

  getBoardPresentation(state) {
    const { rows, cols, cards, cursor } = state
    return Array(rows).fill(null).map((_, r) =>
      Array(cols).fill(null).map((_, c) => {
        const idx = r * cols + c
        const card = cards[idx]
        const isCursor = cursor?.row===r && cursor?.col===c
        return {
          value: card?.flipped || card?.matched ? card.emoji : '?',
          color: card?.matched ? 'matched' : card?.flipped ? 'flipped' : 'hidden',
          selected: isCursor, cursor: isCursor, row: r, col: c, idx,
        }
      })
    )
  }
}

export default new MemoryGame()
