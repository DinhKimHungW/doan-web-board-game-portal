import api from './api'

export const adminApi = {
  getUsers: async (params) => {
    const res = await api.get('/admin/users', { params })
    return res.data?.data || res.data
  },
  updateUser: async (userId, data) => {
    const res = await api.patch(`/admin/users/${userId}`, data)
    return res.data?.data || res.data
  },
  getGames: async () => {
    const res = await api.get('/admin/games')
    return res.data?.data || res.data
  },
  updateGame: async (gameId, data) => {
    const res = await api.patch(`/admin/games/${gameId}`, data)
    return res.data?.data || res.data
  },
  getOverviewStats: async () => {
    const res = await api.get('/admin/stats/overview')
    return res.data?.data || res.data
  },
  getGameStats: async () => {
    const res = await api.get('/admin/stats/games')
    return res.data?.data || res.data
  },
  getUserStats: async () => {
    const res = await api.get('/admin/stats/users')
    return res.data?.data || res.data
  },
}
