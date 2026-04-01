import { GameEngine } from '../GameEngine'

const ROWS = 3, COLS = 3

function checkWinner(board) {
  const lines = [
    // rows
    [[0,0],[0,1],[0,2]], [[1,0],[1,1],[1,2]], [[2,0],[2,1],[2,2]],
    // cols
    [[0,0],[1,0],[2,0]], [[0,1],[1,1],[2,1]], [[0,2],[1,2],[2,2]],
    // diagonals
    [[0,0],[1,1],[2,2]], [[0,2],[1,1],[2,0]],
  ]
  for (const line of lines) {
    const [a,b,c] = line
    if (board[a[0]][a[1]] && board[a[0]][a[1]] === board[b[0]][b[1]] && board[a[0]][a[1]] === board[c[0]][c[1]]) {
      return { winner: board[a[0]][a[1]], line }
    }
  }
  return null
}

function isFull(board) {
  return board.every(row => row.every(c => c !== null))
}

export class TicTacToeGame extends GameEngine {
  createInitialState(config = {}) {
    return {
      board: Array(ROWS).fill(null).map(() => Array(COLS).fill(null)),
      currentPlayer: 'X',
      scores: { X: 0, O: 0 },
      gameOver: false,
      winner: null,
      winLine: null,
      draw: false,
      cursor: { row: 1, col: 1 },
      score: 0,
      mode: config.mode || 'vs_computer',
    }
  }

  applyUserAction(state, action) {
    const s = { ...state, board: state.board.map(r => [...r]) }
    if (action.type === 'MOVE') {
      const { row, col } = action.payload
      if (s.gameOver || s.board[row][col]) return state
      s.board[row][col] = s.currentPlayer
      const win = checkWinner(s.board)
      if (win) {
        s.gameOver = true
        s.winner = win.winner
        s.winLine = win.line
        s.scores = { ...s.scores, [win.winner]: s.scores[win.winner] + 1 }
        s.score = s.scores['X']
      } else if (isFull(s.board)) {
        s.gameOver = true
        s.draw = true
      } else {
        s.currentPlayer = s.currentPlayer === 'X' ? 'O' : 'X'
      }
    } else if (action.type === 'CURSOR') {
      const { row, col } = action.payload
      s.cursor = { row: Math.max(0, Math.min(ROWS-1, row)), col: Math.max(0, Math.min(COLS-1, col)) }
    } else if (action.type === 'RESET') {
      return { ...s, board: Array(ROWS).fill(null).map(() => Array(COLS).fill(null)), currentPlayer: 'X', gameOver: false, winner: null, winLine: null, draw: false, cursor: { row: 1, col: 1 } }
    }
    return s
  }

  applyComputerMove(state) {
    if (state.gameOver || state.currentPlayer !== 'O' || state.mode !== 'vs_computer') return state
    const empty = []
    state.board.forEach((row, r) => row.forEach((c, col) => { if (!c) empty.push({ row: r, col }) }))
    if (!empty.length) return state
    const move = empty[Math.floor(Math.random() * empty.length)]
    return this.applyUserAction(state, { type: 'MOVE', payload: move })
  }

  getHint(state) {
    const empty = []
    state.board.forEach((row, r) => row.forEach((c, col) => { if (!c) empty.push({ row: r, col }) }))
    if (!empty.length) return null
    return empty[Math.floor(Math.random() * empty.length)]
  }

  isGameOver(state) {
    if (!state.gameOver) return { over: false, result: null }
    if (state.draw) return { over: true, result: 'DRAW' }
    return { over: true, result: state.winner === 'X' ? 'WIN' : 'LOSE' }
  }

  getBoardPresentation(state) {
    return state.board.map((row, r) =>
      row.map((cell, c) => {
        const isWin = state.winLine?.some(([wr,wc]) => wr===r && wc===c)
        const isCursor = state.cursor?.row === r && state.cursor?.col === c
        return {
          value: cell,
          color: isWin ? 'win' : cell === 'X' ? 'blue' : cell === 'O' ? 'red' : 'empty',
          selected: isCursor,
          cursor: isCursor,
          row: r, col: c,
        }
      })
    )
  }

  calculateScore(state) { return state.scores?.X || 0 }
}

export default new TicTacToeGame()
