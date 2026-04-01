import api from './api'

export const rankingsApi = {
  get: async (gameSlug, scope = 'global', params = {}) => {
    const res = await api.get('/rankings', { params: { game: gameSlug, scope, ...params } })
    return res.data?.data || res.data
  },
}
