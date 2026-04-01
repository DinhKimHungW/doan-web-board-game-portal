import api from './api'

export const gameSessionsApi = {
  // POST /game-sessions body: {gameId, mode, timerSetting, boardRows, boardCols}
  create: async (body) => {
    const res = await api.post('/game-sessions', body)
    return res.data?.data || res.data
  },
  get: async (sessionId) => {
    const res = await api.get(`/game-sessions/${sessionId}`)
    return res.data?.data || res.data
  },
  list: async (params = {}) => {
    const res = await api.get('/game-sessions', { params })
    return res.data?.data || res.data
  },
  updateState: async (sessionId, { currentStateJson, score, elapsedSeconds }) => {
    const res = await api.patch(`/game-sessions/${sessionId}/state`, { currentStateJson, score, elapsedSeconds })
    return res.data?.data || res.data
  },
  saveSlot: async (sessionId, slotName, snapshotJson) => {
    const res = await api.post(`/game-sessions/${sessionId}/save`, { slotName, snapshotJson })
    return res.data?.data || res.data
  },
  listSaves: async (sessionId) => {
    const res = await api.get(`/game-sessions/${sessionId}/saves`)
    return res.data?.data || res.data
  },
  complete: async (sessionId, { score, result }) => {
    const res = await api.post(`/game-sessions/${sessionId}/complete`, { score, result })
    return res.data?.data || res.data
  },
}
