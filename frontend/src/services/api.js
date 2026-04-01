import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1',
  withCredentials: true,
})

let isRefreshing = false
let failedQueue = []

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) prom.reject(error)
    else prom.resolve(token)
  })
  failedQueue = []
}

// Request interceptor: attach token
api.interceptors.request.use(config => {
  const token = api.defaults.headers.common['Authorization']
  if (token) config.headers['Authorization'] = token
  return config
})

// Response interceptor: unwrap data, auto-refresh on 401
api.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject })
        }).then(token => {
          originalRequest.headers['Authorization'] = `Bearer ${token}`
          return api(originalRequest)
        })
      }

      originalRequest._retry = true
      isRefreshing = true

      try {
        const storedRT = localStorage.getItem('refreshToken')
        const res = await axios.post(
          `${api.defaults.baseURL}/auth/refresh`,
          { refreshToken: storedRT },
          { withCredentials: true }
        )
        const d = res.data?.data || res.data
        const newToken = d?.accessToken
        if (d?.refreshToken) localStorage.setItem('refreshToken', d.refreshToken)
        if (newToken) {
          api.defaults.headers.common['Authorization'] = `Bearer ${newToken}`
          originalRequest.headers['Authorization'] = `Bearer ${newToken}`
          processQueue(null, newToken)
          return api(originalRequest)
        }
      } catch (refreshError) {
        processQueue(refreshError, null)
        localStorage.removeItem('refreshToken')
      } finally {
        isRefreshing = false
      }
    }

    return Promise.reject(error)
  }
)

export default api
