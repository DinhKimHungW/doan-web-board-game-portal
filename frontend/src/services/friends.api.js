import api from './api'

export const friendsApi = {
  list: async () => {
    const res = await api.get('/friends')
    return res.data?.data || res.data
  },
  getPendingRequests: async () => {
    const res = await api.get('/friend-requests')
    return res.data?.data || res.data
  },
  sendRequest: async (receiverId) => {
    const res = await api.post('/friend-requests', { receiverId })
    return res.data?.data || res.data
  },
  acceptRequest: async (requestId) => {
    const res = await api.patch(`/friend-requests/${requestId}/accept`)
    return res.data?.data || res.data
  },
  rejectRequest: async (requestId) => {
    const res = await api.patch(`/friend-requests/${requestId}/reject`)
    return res.data?.data || res.data
  },
  removeFriend: async (friendId) => {
    const res = await api.delete(`/friends/${friendId}`)
    return res.data?.data || res.data
  },
}
