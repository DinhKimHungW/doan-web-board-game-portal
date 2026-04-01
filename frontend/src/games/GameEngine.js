/**
 * Base Game Engine interface
 * All games must implement these methods
 */
export class GameEngine {
  /** Create initial state from config {rows, cols, timerSetting, mode} */
  createInitialState(config) { throw new Error('Not implemented') }

  /** Serialize state to JSON string */
  serializeState(state) { return JSON.stringify(state) }

  /** Deserialize JSON string to state */
  deserializeState(json) { return JSON.parse(json) }

  /** Apply user action {type, payload} and return new state */
  applyUserAction(state, action) { throw new Error('Not implemented') }

  /** Apply computer move and return new state (null if no computer) */
  applyComputerMove(state) { return state }

  /** Calculate current score from state */
  calculateScore(state) { return state.score || 0 }

  /** Get hint: returns {row, col} or description string */
  getHint(state) { return null }

  /** Check if game is over: returns {over, result: 'WIN'|'LOSE'|'DRAW'|null} */
  isGameOver(state) { return { over: false, result: null } }

  /** Get 2D board presentation for rendering */
  getBoardPresentation(state) { throw new Error('Not implemented') }
}

export default GameEngine
