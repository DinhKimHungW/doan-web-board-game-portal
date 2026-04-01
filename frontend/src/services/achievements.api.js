import api from './api'

export const achievementsApi = {
  listAll: async () => {
    const res = await api.get('/achievements')
    return res.data?.data || res.data
  },
  listMine: async () => {
    const res = await api.get('/users/me/achievements')
    return res.data?.data || res.data
  },
}
