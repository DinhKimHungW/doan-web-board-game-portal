import { GameEngine } from '../GameEngine'

const PALETTE = ['#ef4444','#f97316','#eab308','#22c55e','#06b6d4','#6366f1','#a855f7','#ec4899','#ffffff','#1e293b']

export class DrawGame extends GameEngine {
  createInitialState(config = {}) {
    const rows = config.rows || 20, cols = config.cols || 20
    return {
      rows, cols,
      grid: Array(rows).fill(null).map(() => Array(cols).fill('#1e293b')),
      selectedColor: '#ef4444',
      palette: PALETTE,
      cursor: { row: 0, col: 0 },
      score: 0, gameOver: false,
    }
  }

  applyUserAction(state, action) {
    const s = { ...state, grid: state.grid.map(r => [...r]) }
    if (action.type === 'PAINT') {
      const { row, col } = action.payload
      s.grid[row][col] = s.selectedColor
    } else if (action.type === 'COLOR') {
      s.selectedColor = action.payload
    } else if (action.type === 'CURSOR') {
      s.cursor = { row: Math.max(0,Math.min(s.rows-1,action.payload.row)), col: Math.max(0,Math.min(s.cols-1,action.payload.col)) }
    } else if (action.type === 'CYCLE_COLOR') {
      const idx = s.palette.indexOf(s.selectedColor)
      s.selectedColor = s.palette[(idx + 1) % s.palette.length]
    } else if (action.type === 'RESET') {
      return { ...s, grid: Array(s.rows).fill(null).map(() => Array(s.cols).fill('#1e293b')) }
    }
    return s
  }

  isGameOver(state) { return { over: false, result: null } }
  calculateScore(state) { return 0 }
  getHint(state) { return `Color: ${state.selectedColor}. Click cells to paint!` }

  getBoardPresentation(state) {
    return state.grid.map((row, r) =>
      row.map((color, c) => {
        const isCursor = state.cursor?.row===r && state.cursor?.col===c
        return { value: '', color, selected: isCursor, cursor: isCursor, row: r, col: c }
      })
    )
  }
}

export default new DrawGame()
