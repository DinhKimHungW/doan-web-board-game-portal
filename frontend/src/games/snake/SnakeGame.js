import { GameEngine } from '../GameEngine'

function randFood(snake, rows, cols) {
  const occupied = new Set(snake.map(s => `${s.row},${s.col}`))
  let r, c
  do { r = Math.floor(Math.random()*rows); c = Math.floor(Math.random()*cols) } while (occupied.has(`${r},${c}`))
  return { row: r, col: c }
}

// Directions: UP, DOWN, LEFT, RIGHT
const DIRS = { UP: [-1,0], DOWN: [1,0], LEFT: [0,-1], RIGHT: [0,1] }
const OPPOSITE = { UP: 'DOWN', DOWN: 'UP', LEFT: 'RIGHT', RIGHT: 'LEFT' }

export class SnakeGame extends GameEngine {
  createInitialState(config = {}) {
    const rows = config.rows || 16, cols = config.cols || 16
    const snake = [{ row: Math.floor(rows/2), col: Math.floor(cols/2) }]
    return {
      rows, cols, snake,
      direction: 'RIGHT',
      food: randFood(snake, rows, cols),
      score: 0, gameOver: false,
      speed: config.speed || 250,
    }
  }

  applyUserAction(state, action) {
    const s = { ...state }
    if (action.type === 'DIRECTION') {
      const newDir = action.payload
      if (OPPOSITE[s.direction] !== newDir) s.direction = newDir
    } else if (action.type === 'TICK') {
      if (s.gameOver) return s
      const head = s.snake[0]
      const [dr, dc] = DIRS[s.direction]
      const newHead = { row: head.row + dr, col: head.col + dc }
      // Wall collision
      if (newHead.row < 0 || newHead.row >= s.rows || newHead.col < 0 || newHead.col >= s.cols) {
        return { ...s, gameOver: true }
      }
      // Self collision
      if (s.snake.some(seg => seg.row === newHead.row && seg.col === newHead.col)) {
        return { ...s, gameOver: true }
      }
      const newSnake = [newHead, ...s.snake]
      let newFood = s.food
      let newScore = s.score
      if (newHead.row === s.food.row && newHead.col === s.food.col) {
        newScore += 10
        newFood = randFood(newSnake, s.rows, s.cols)
      } else {
        newSnake.pop()
      }
      return { ...s, snake: newSnake, food: newFood, score: newScore }
    } else if (action.type === 'RESET') {
      return this.createInitialState({ rows: s.rows, cols: s.cols })
    }
    return s
  }

  getHint(state) {
    return `Head at (${state.snake[0]?.row},${state.snake[0]?.col}) → Food at (${state.food?.row},${state.food?.col})`
  }

  isGameOver(state) {
    return { over: state.gameOver, result: state.gameOver ? 'LOSE' : null }
  }

  calculateScore(state) { return state.score }

  getBoardPresentation(state) {
    const { rows, cols, snake, food } = state
    const snakeSet = new Set(snake.map((s,i) => `${s.row},${s.col}:${i}`))
    const isHead = (r,c) => snake[0]?.row===r && snake[0]?.col===c
    const isSnake = (r,c) => snake.some(s => s.row===r && s.col===c)
    const isFood = (r,c) => food?.row===r && food?.col===c
    return Array(rows).fill(null).map((_,r) =>
      Array(cols).fill(null).map((_,c) => ({
        value: isHead(r,c) ? 'H' : isSnake(r,c) ? 'S' : isFood(r,c) ? 'F' : '',
        color: isHead(r,c) ? 'head' : isSnake(r,c) ? 'snake' : isFood(r,c) ? 'food' : 'empty',
        row: r, col: c, cursor: false, selected: false,
      }))
    )
  }
}

export default new SnakeGame()
