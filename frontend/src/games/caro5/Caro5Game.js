import { GameEngine } from '../GameEngine'

function checkWin(board, rows, cols, winLen = 5) {
  const directions = [[0,1],[1,0],[1,1],[1,-1]]
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const v = board[r][c]
      if (!v) continue
      for (const [dr,dc] of directions) {
        const cells = [[r,c]]
        for (let i = 1; i < winLen; i++) {
          const nr = r+dr*i, nc = c+dc*i
          if (nr<0||nr>=rows||nc<0||nc>=cols||board[nr][nc]!==v) break
          cells.push([nr,nc])
        }
        if (cells.length===winLen) return { winner: v, line: cells }
      }
    }
  }
  return null
}

export class Caro5Game extends GameEngine {
  createInitialState(config = {}) {
    const rows = config.rows || 12, cols = config.cols || 12
    return {
      board: Array(rows).fill(null).map(() => Array(cols).fill(null)),
      rows, cols, winLen: 5,
      currentPlayer: 'X', scores: { X: 0, O: 0 },
      gameOver: false, winner: null, winLine: null, draw: false,
      cursor: { row: Math.floor(rows/2), col: Math.floor(cols/2) },
      score: 0, mode: config.mode || 'vs_computer',
    }
  }

  applyUserAction(state, action) {
    const s = { ...state, board: state.board.map(r => [...r]) }
    if (action.type === 'MOVE') {
      const { row, col } = action.payload
      if (s.gameOver || s.board[row][col]) return state
      s.board[row][col] = s.currentPlayer
      const win = checkWin(s.board, s.rows, s.cols, s.winLen)
      if (win) {
        s.gameOver = true; s.winner = win.winner; s.winLine = win.line
        s.scores = { ...s.scores, [win.winner]: s.scores[win.winner]+1 }
        s.score = s.scores['X']
      } else if (s.board.every(r => r.every(c => c))) {
        s.gameOver = true; s.draw = true
      } else {
        s.currentPlayer = s.currentPlayer === 'X' ? 'O' : 'X'
      }
    } else if (action.type === 'CURSOR') {
      s.cursor = { row: Math.max(0,Math.min(s.rows-1,action.payload.row)), col: Math.max(0,Math.min(s.cols-1,action.payload.col)) }
    } else if (action.type === 'RESET') {
      return { ...this.createInitialState({ rows: s.rows, cols: s.cols, mode: s.mode }), scores: s.scores }
    }
    return s
  }

  applyComputerMove(state) {
    if (state.gameOver || state.currentPlayer !== 'O' || state.mode !== 'vs_computer') return state
    const empty = []
    state.board.forEach((row,r) => row.forEach((c,col) => { if (!c) empty.push({row:r,col}) }))
    if (!empty.length) return state
    return this.applyUserAction(state, { type: 'MOVE', payload: empty[Math.floor(Math.random()*empty.length)] })
  }

  getHint(state) {
    const empty = []
    state.board.forEach((row,r) => row.forEach((c,col) => { if (!c) empty.push({row:r,col}) }))
    return empty[Math.floor(Math.random()*empty.length)] || null
  }

  isGameOver(state) {
    if (!state.gameOver) return { over: false, result: null }
    if (state.draw) return { over: true, result: 'DRAW' }
    return { over: true, result: state.winner==='X'?'WIN':'LOSE' }
  }

  getBoardPresentation(state) {
    return state.board.map((row,r) =>
      row.map((cell,c) => {
        const isWin = state.winLine?.some(([wr,wc]) => wr===r&&wc===c)
        const isCursor = state.cursor?.row===r&&state.cursor?.col===c
        return { value: cell, color: isWin?'win':cell==='X'?'blue':cell==='O'?'red':'empty', selected: isCursor, cursor: isCursor, row:r, col:c }
      })
    )
  }
}

export default new Caro5Game()
