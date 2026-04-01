import api from './api'

export const conversationsApi = {
  list: async () => {
    const res = await api.get('/conversations')
    return res.data?.data || res.data
  },
  getOrCreate: async (userId) => {
    const res = await api.post('/conversations', { userId })
    return res.data?.data || res.data
  },
  getMessages: async (conversationId, params) => {
    const res = await api.get(`/conversations/${conversationId}/messages`, { params })
    return res.data?.data || res.data
  },
  sendMessage: async (conversationId, content) => {
    const res = await api.post(`/conversations/${conversationId}/messages`, { content })
    return res.data?.data || res.data
  },
}
