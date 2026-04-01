import { useState, useCallback } from 'react'
import { gameSessionsApi } from '../services/game-sessions.api'

export function useGameSession(gameSlug) {
  const [sessionId, setSessionId] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const createSession = useCallback(async (config) => {
    setLoading(true)
    setError(null)
    try {
      const session = await gameSessionsApi.create(gameSlug, config)
      setSessionId(session.id || session._id)
      return session
    } catch (e) {
      setError(e.message)
      return null
    } finally {
      setLoading(false)
    }
  }, [gameSlug])

  const saveSession = useCallback(async (stateJson) => {
    if (!sessionId) return null
    try {
      return await gameSessionsApi.save(sessionId, stateJson)
    } catch (e) {
      setError(e.message)
      return null
    }
  }, [sessionId])

  const completeSession = useCallback(async (score, result) => {
    if (!sessionId) return null
    try {
      return await gameSessionsApi.complete(sessionId, score, result)
    } catch (e) {
      setError(e.message)
      return null
    }
  }, [sessionId])

  const loadLatest = useCallback(async () => {
    setLoading(true)
    try {
      const session = await gameSessionsApi.getLatest(gameSlug)
      if (session?.id || session?._id) {
        setSessionId(session.id || session._id)
      }
      return session
    } catch {
      return null
    } finally {
      setLoading(false)
    }
  }, [gameSlug])

  return { sessionId, loading, error, createSession, saveSession, completeSession, loadLatest }
}
