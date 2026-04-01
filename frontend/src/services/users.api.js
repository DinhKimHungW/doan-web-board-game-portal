import api from './api'

export const usersApi = {
  getProfile: async (userId) => {
    const res = await api.get(`/users/${userId}`)
    return res.data?.data || res.data
  },
  updateProfile: async (data) => {
    const res = await api.patch('/users/me', data)
    return res.data?.data || res.data
  },
  changePassword: async (currentPassword, newPassword) => {
    const res = await api.patch('/users/me/password', { currentPassword, newPassword })
    return res.data?.data || res.data
  },
  searchUsers: async (query, params = {}) => {
    const res = await api.get('/users/search', { params: { q: query, ...params } })
    return res.data?.data || res.data
  },
}
