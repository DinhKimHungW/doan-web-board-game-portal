import api from './api'

export const authApi = {
  login: async (email, password) => {
    const res = await api.post('/auth/login', { email, password })
    return res.data?.data || res.data
  },
  register: async (name, email, password) => {
    const res = await api.post('/auth/register', { name, email, password })
    return res.data?.data || res.data
  },
  logout: async (refreshToken) => {
    const res = await api.post('/auth/logout', { refreshToken })
    return res.data
  },
  refresh: async (refreshToken) => {
    const res = await api.post('/auth/refresh', { refreshToken })
    return res.data?.data || res.data
  },
  me: async () => {
    const res = await api.get('/auth/me')
    const d = res.data?.data || res.data
    return d?.user || d
  },
}
