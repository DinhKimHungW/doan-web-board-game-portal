import api from './api'

export const gamesApi = {
  list: async (params) => {
    const res = await api.get('/games', { params })
    const d = res.data?.data || res.data
    return d?.games || d
  },
  getBySlug: async (slug) => {
    const res = await api.get(`/games/${slug}`)
    const d = res.data?.data || res.data
    return d?.game || d
  },
  getReviews: async (slug, params) => {
    const res = await api.get(`/games/${slug}/reviews`, { params })
    const d = res.data?.data || res.data
    return { reviews: d?.reviews || [], my_review: d?.my_review || null, pagination: res.data?.pagination || {} }
  },
  addReview: async (slug, { rating, comment }) => {
    const res = await api.post(`/games/${slug}/reviews`, { rating, comment })
    const d = res.data?.data || res.data
    return d?.review || d
  },
  updateReview: async (slug, reviewId, data) => {
    const res = await api.patch(`/games/${slug}/reviews/${reviewId}`, data)
    const d = res.data?.data || res.data
    return d?.review || d
  },
}
