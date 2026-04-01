import { GameEngine } from '../GameEngine'

const COLORS = ['red', 'blue', 'green', 'yellow', 'purple', 'orange']
const NUM_COLORS = COLORS.length

function randColor() { return COLORS[Math.floor(Math.random() * NUM_COLORS)] }

function createBoard(rows, cols) {
  return Array(rows).fill(null).map(() => Array(cols).fill(null).map(() => randColor()))
}

function findMatches(board, rows, cols) {
  const matched = Array(rows).fill(null).map(() => Array(cols).fill(false))
  // Horizontal
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c <= cols-3; c++) {
      const v = board[r][c]
      if (v && board[r][c+1]===v && board[r][c+2]===v) {
        matched[r][c]=matched[r][c+1]=matched[r][c+2]=true
      }
    }
  }
  // Vertical
  for (let c = 0; c < cols; c++) {
    for (let r = 0; r <= rows-3; r++) {
      const v = board[r][c]
      if (v && board[r+1][c]===v && board[r+2][c]===v) {
        matched[r][c]=matched[r+1][c]=matched[r+2][c]=true
      }
    }
  }
  return matched
}

function applyGravity(board, rows, cols) {
  const newBoard = board.map(r => [...r])
  for (let c = 0; c < cols; c++) {
    let empty = rows - 1
    for (let r = rows-1; r >= 0; r--) {
      if (newBoard[r][c] !== null) { newBoard[empty][c] = newBoard[r][c]; if (empty !== r) newBoard[r][c]=null; empty-- }
    }
    for (let r = empty; r >= 0; r--) newBoard[r][c] = randColor()
  }
  return newBoard
}

export class Match3Game extends GameEngine {
  createInitialState(config = {}) {
    const rows = config.rows || 8, cols = config.cols || 8
    return {
      board: createBoard(rows, cols),
      rows, cols, score: 0, selected: null, gameOver: false,
      cursor: { row: 0, col: 0 },
    }
  }

  applyUserAction(state, action) {
    let s = { ...state, board: state.board.map(r => [...r]) }
    if (action.type === 'SELECT') {
      const { row, col } = action.payload
      if (!s.selected) {
        s.selected = { row, col }
      } else {
        // Check adjacency
        const dr = Math.abs(s.selected.row - row), dc = Math.abs(s.selected.col - col)
        if ((dr===1&&dc===0)||(dr===0&&dc===1)) {
          // Swap
          const tmp = s.board[s.selected.row][s.selected.col]
          s.board[s.selected.row][s.selected.col] = s.board[row][col]
          s.board[row][col] = tmp
          // Check matches
          const matched = findMatches(s.board, s.rows, s.cols)
          const hasMatch = matched.some(r => r.some(v => v))
          if (!hasMatch) {
            // Revert
            const tmp2 = s.board[s.selected.row][s.selected.col]
            s.board[s.selected.row][s.selected.col] = s.board[row][col]
            s.board[row][col] = tmp2
            s.selected = null
          } else {
            let count = matched.reduce((a,r)=>a+r.filter(Boolean).length,0)
            for (let r=0;r<s.rows;r++) for (let c=0;c<s.cols;c++) if (matched[r][c]) s.board[r][c]=null
            s.board = applyGravity(s.board, s.rows, s.cols)
            s.score += count * 10
            s.selected = null
          }
        } else {
          s.selected = { row, col }
        }
      }
    } else if (action.type === 'CURSOR') {
      s.cursor = { row: Math.max(0,Math.min(s.rows-1,action.payload.row)), col: Math.max(0,Math.min(s.cols-1,action.payload.col)) }
    } else if (action.type === 'RESET') {
      return this.createInitialState({ rows: s.rows, cols: s.cols })
    }
    return s
  }

  getHint(state) {
    // Find first valid swap
    for (let r = 0; r < state.rows; r++) {
      for (let c = 0; c < state.cols - 1; c++) {
        const board = state.board.map(row => [...row])
        const tmp = board[r][c]; board[r][c] = board[r][c+1]; board[r][c+1] = tmp
        const m = findMatches(board, state.rows, state.cols)
        if (m.some(row => row.some(v => v))) return { row: r, col: c }
      }
    }
    return 'No obvious moves, board will reshuffle!'
  }

  isGameOver(state) { return { over: false, result: null } }
  calculateScore(state) { return state.score }

  getBoardPresentation(state) {
    return state.board.map((row, r) =>
      row.map((cell, c) => {
        const isSel = state.selected?.row===r && state.selected?.col===c
        const isCursor = state.cursor?.row===r && state.cursor?.col===c
        return { value: cell, color: cell || 'empty', selected: isSel, cursor: isCursor, row: r, col: c }
      })
    )
  }
}

export default new Match3Game()
