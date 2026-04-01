import React, { useEffect, useState, useCallback, useRef } from 'react'
import { useParams, useNavigate, useBlocker } from 'react-router-dom'
import { gamesApi } from '../../services/games.api'
import { gameSessionsApi } from '../../services/game-sessions.api'
import GameHUD from '../../components/board/GameHUD'
import GameInstructionsModal from '../../components/board/GameInstructionsModal'
import GameReviewSection from '../../components/board/GameReviewSection'
import ConfirmDialog from '../../components/common/ConfirmDialog'
import LoadingSpinner from '../../components/common/LoadingSpinner'

// Game Engines
import { TicTacToeGame } from '../../games/tic_tac_toe/TicTacToeGame'
import TicTacToeBoard from '../../games/tic_tac_toe/TicTacToeBoard'
import { Caro4Game } from '../../games/caro4/Caro4Game'
import Caro4Board from '../../games/caro4/Caro4Board'
import { Caro5Game } from '../../games/caro5/Caro5Game'
import Caro5Board from '../../games/caro5/Caro5Board'
import { SnakeGame } from '../../games/snake/SnakeGame'
import SnakeBoard from '../../games/snake/SnakeBoard'
import { Match3Game } from '../../games/match3/Match3Game'
import Match3Board from '../../games/match3/Match3Board'
import { MemoryGame } from '../../games/memory/MemoryGame'
import MemoryBoard from '../../games/memory/MemoryBoard'
import { DrawGame } from '../../games/draw/DrawGame'
import DrawBoard from '../../games/draw/DrawBoard'

// Map API slugs (with hyphens) to engine classes
const ENGINES = {
  'tic-tac-toe': TicTacToeGame, 'tic_tac_toe': TicTacToeGame,
  caro4: Caro4Game, caro5: Caro5Game,
  snake: SnakeGame, match3: Match3Game,
  memory: MemoryGame, draw: DrawGame,
}

const BOARDS = {
  'tic-tac-toe': TicTacToeBoard, 'tic_tac_toe': TicTacToeBoard,
  caro4: Caro4Board, caro5: Caro5Board,
  snake: SnakeBoard, match3: Match3Board,
  memory: MemoryBoard, draw: DrawBoard,
}

export default function GamePlayPage() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const [gameConfig, setGameConfig] = useState(null)
  const [sessionId, setSessionId] = useState(null)
  const [gameState, setGameState] = useState(null)
  const [engine, setEngine] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showInstructions, setShowInstructions] = useState(false)
  const [showReview, setShowReview] = useState(false)
  const [showQuitConfirm, setShowQuitConfirm] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [timer, setTimer] = useState(0)
  const timerRef = useRef(null)
  const stateRef = useRef(gameState)
  const sessionRef = useRef(sessionId)
  const autoSaveTimer = useRef(null)

  stateRef.current = gameState
  sessionRef.current = sessionId

  // Load game config
  useEffect(() => {
    gamesApi.getBySlug(slug).then(g => {
      setGameConfig(g)
    }).catch(() => navigate('/games'))
  }, [slug])

  // Init engine and session when config loaded
  useEffect(() => {
    if (!gameConfig) return
    const EngineClass = ENGINES[slug]
    if (!EngineClass) { navigate('/games'); return }

    const eng = new EngineClass()
    setEngine(eng)

    const config = {
      rows: gameConfig.default_rows,
      cols: gameConfig.default_cols,
      timerSetting: gameConfig.default_time_limit,
      mode: 'vs_computer',
    }
    const initialState = eng.createInitialState(config)
    setGameState(initialState)
    setTimer(config.timerSetting || 0)

    // Create session - filter out null/undefined values
    const sessionBody = { gameId: gameConfig.id, mode: config.mode }
    if (config.timerSetting != null) sessionBody.timerSetting = config.timerSetting
    if (config.rows) sessionBody.boardRows = config.rows
    if (config.cols) sessionBody.boardCols = config.cols
    gameSessionsApi.create(sessionBody).then(session => {
      const s = session?.session || session
      setSessionId(s?.id)
    }).catch(() => {})

    setLoading(false)
    setShowInstructions(true)
  }, [gameConfig])

  // Timer
  useEffect(() => {
    if (!gameState || !engine) return
    const { over } = engine.isGameOver(gameState)
    if (over) { clearInterval(timerRef.current); return }

    clearInterval(timerRef.current)
    const hasLimit = gameConfig?.default_time_limit > 0
    timerRef.current = setInterval(() => {
      setTimer(t => {
        if (hasLimit) {
          if (t <= 1) {
            clearInterval(timerRef.current)
            // time up -> game over
            setGameState(prev => ({ ...prev, gameOver: true, timeUp: true }))
            return 0
          }
          return t - 1
        }
        return t + 1
      })
    }, 1000)
    return () => clearInterval(timerRef.current)
  }, [gameState?.gameOver, engine])

  // Auto-save every 30s
  useEffect(() => {
    clearInterval(autoSaveTimer.current)
    if (!sessionId || !engine || !gameState) return
    autoSaveTimer.current = setInterval(() => {
      if (sessionRef.current && stateRef.current) {
        gameSessionsApi.updateState(sessionRef.current, {
          currentStateJson: stateRef.current,
          score: engine.calculateScore(stateRef.current),
          elapsedSeconds: 0,
        }).catch(() => {})
      }
    }, 30000)
    return () => clearInterval(autoSaveTimer.current)
  }, [sessionId, engine])

  // Game over handler
  useEffect(() => {
    if (!gameState || !engine || !sessionId) return
    const { over, result } = engine.isGameOver(gameState)
    if (over) {
      clearInterval(timerRef.current)
      const score = engine.calculateScore(gameState)
      gameSessionsApi.complete(sessionId, { score, result: result || 'DRAW' }).catch(() => {})
      setTimeout(() => setShowReview(true), 1500)
    }
  }, [gameState?.gameOver])

  const applyAction = useCallback((action) => {
    if (!engine || !gameState) return
    const { over } = engine.isGameOver(gameState)
    if (over) return

    let newState = engine.applyUserAction(gameState, action)

    // Computer move
    const afterAction = engine.isGameOver(newState)
    if (!afterAction.over && newState.currentPlayer === 'O' && newState.mode === 'vs_computer') {
      setTimeout(() => {
        setGameState(prev => {
          if (engine.isGameOver(prev).over) return prev
          return engine.applyComputerMove(prev)
        })
      }, 400)
    }

    setGameState(newState)
  }, [engine, gameState])

  const moveCursor = useCallback((dr, dc) => {
    if (!gameState || !engine) return
    const rows = gameConfig?.default_rows || 3
    const cols = gameConfig?.default_cols || 3
    const cur = gameState.cursor || { row: 0, col: 0 }
    const newRow = Math.max(0, Math.min(rows - 1, cur.row + dr))
    const newCol = Math.max(0, Math.min(cols - 1, cur.col + dc))
    setGameState(prev => ({ ...prev, cursor: { row: newRow, col: newCol } }))
  }, [gameState, engine, gameConfig])

  const handleEnter = useCallback(() => {
    if (!gameState) return
    const cur = gameState.cursor || { row: 0, col: 0 }
    applyAction({ type: 'MOVE', payload: { row: cur.row, col: cur.col } })
  }, [gameState, applyAction])

  const handleCellClick = useCallback((r, c) => {
    setGameState(prev => ({ ...prev, cursor: { row: r, col: c } }))
    applyAction({ type: 'MOVE', payload: { row: r, col: c } })
  }, [applyAction])

  const handleSave = async () => {
    if (!sessionId || !gameState || !engine) return
    setIsSaving(true)
    try {
      const stateJson = engine.serializeState(gameState)
      await gameSessionsApi.saveSlot(sessionId, 'slot1', stateJson)
      await gameSessionsApi.updateState(sessionId, {
        currentStateJson: gameState,
        score: engine.calculateScore(gameState),
        elapsedSeconds: 0,
      })
      alert('Game saved!')
    } catch {
      alert('Failed to save game')
    }
    setIsSaving(false)
  }

  const handleLoad = async () => {
    if (!sessionId || !engine) return
    try {
      const saves = await gameSessionsApi.listSaves(sessionId)
      if (!saves?.length) { alert('No saved games'); return }
      const latest = saves[saves.length - 1]
      const snapshot = typeof latest.snapshot_json === 'string'
        ? engine.deserializeState(latest.snapshot_json)
        : latest.snapshot_json
      setGameState(snapshot)
      setTimer(gameConfig?.default_time_limit || 0)
    } catch {
      alert('Failed to load game')
    }
  }

  const handleNewGame = () => {
    if (!engine || !gameConfig) return
    const config = {
      rows: gameConfig.default_rows,
      cols: gameConfig.default_cols,
      timerSetting: gameConfig.default_time_limit,
      mode: 'vs_computer',
    }
    setGameState(engine.createInitialState(config))
    setTimer(config.timerSetting || 0)
    setShowReview(false)
  }

  const handleQuit = () => setShowQuitConfirm(true)

  // Keyboard support
  useEffect(() => {
    const handleKey = (e) => {
      if (!gameState || engine?.isGameOver(gameState).over) return
      switch (e.key) {
        case 'ArrowLeft': moveCursor(0, -1); break
        case 'ArrowRight': moveCursor(0, 1); break
        case 'ArrowUp': moveCursor(-1, 0); break
        case 'ArrowDown': moveCursor(1, 0); break
        case 'Enter': handleEnter(); break
        case 'Escape': handleQuit(); break
        default: break
      }
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [moveCursor, handleEnter, gameState, engine])

  if (loading || !gameConfig || !gameState || !engine) {
    return <div className="flex items-center justify-center h-screen"><LoadingSpinner size="lg" /></div>
  }

  const BoardComponent = BOARDS[slug]
  const presentation = engine.getBoardPresentation ? engine.getBoardPresentation(gameState) : []
  const { over: isOver, result } = engine.isGameOver(gameState)
  const score = engine.calculateScore(gameState)

  const getStatus = () => {
    if (!isOver) {
      if (gameState.currentPlayer) return `Player ${gameState.currentPlayer}'s turn`
      return 'Playing...'
    }
    if (result === 'WIN') return 'You Win! 🎉'
    if (result === 'LOSE') return 'Computer Wins!'
    if (result === 'DRAW') return "It's a Draw!"
    if (gameState.timeUp) return 'Time Up!'
    return 'Game Over'
  }

  return (
    <div className="flex flex-col lg:flex-row h-[calc(100vh-64px)] overflow-hidden">
      {/* Board area */}
      <div className="flex-1 flex items-center justify-center bg-slate-900 p-4 overflow-auto">
        {isOver && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-10 pointer-events-none">
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 text-center shadow-2xl pointer-events-auto">
              <div className="text-5xl mb-4">
                {result === 'WIN' ? '🏆' : result === 'LOSE' ? '😞' : '🤝'}
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{getStatus()}</h2>
              <p className="text-gray-500 dark:text-gray-400 mb-6">Score: <span className="font-bold text-primary-500">{score}</span></p>
              <div className="flex gap-3 justify-center">
                <button onClick={handleNewGame} className="btn btn-primary">New Game</button>
                <button onClick={() => navigate('/games')} className="btn btn-secondary">Back to Games</button>
              </div>
            </div>
          </div>
        )}
        <BoardComponent
          presentation={presentation}
          state={gameState}
          onCellClick={handleCellClick}
          onAction={applyAction}
          cursor={gameState.cursor}
        />
      </div>

      {/* HUD */}
      <div className="w-full lg:w-72 bg-slate-800 overflow-y-auto flex-shrink-0">
        <GameHUD
          gameName={gameConfig.name}
          gameSlug={slug}
          score={score}
          timer={timer}
          timerDirection={gameConfig.default_time_limit > 0 ? 'down' : 'up'}
          status={getStatus()}
          currentPlayer={gameState.currentPlayer}
          gameOver={isOver}
          onSave={handleSave}
          onLoad={handleLoad}
          onNewGame={handleNewGame}
          onQuit={handleQuit}
          onLeft={() => moveCursor(0, -1)}
          onRight={() => moveCursor(0, 1)}
          onUp={() => moveCursor(-1, 0)}
          onDown={() => moveCursor(1, 0)}
          onEnter={handleEnter}
          onBack={handleQuit}
          onHint={() => setShowInstructions(true)}
          isSaving={isSaving}
        />
      </div>

      {/* Modals */}
      <GameInstructionsModal
        isOpen={showInstructions}
        onClose={() => setShowInstructions(false)}
        gameSlug={slug}
        gameName={gameConfig.name}
      />

      {showReview && (
        <div className="fixed bottom-4 right-4 z-50 card p-4 shadow-xl w-80">
          <h3 className="font-bold mb-2">Rate this game!</h3>
          <GameReviewSection gameSlug={slug} onClose={() => setShowReview(false)} />
        </div>
      )}

      <ConfirmDialog
        isOpen={showQuitConfirm}
        title="Quit Game?"
        message="Your unsaved progress will be lost. Are you sure you want to quit?"
        confirmLabel="Quit"
        onConfirm={() => { setShowQuitConfirm(false); navigate('/games') }}
        onCancel={() => setShowQuitConfirm(false)}
        variant="danger"
      />
    </div>
  )
}
