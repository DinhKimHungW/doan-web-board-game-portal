import React, { createContext, useState, useEffect, useCallback } from 'react'
import api from '../services/api'
import { authApi } from '../services/auth.api'

export const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [accessToken, setAccessToken] = useState(null)
  const [loading, setLoading] = useState(true)

  const updateToken = useCallback((token) => {
    setAccessToken(token)
    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`
    } else {
      delete api.defaults.headers.common['Authorization']
    }
  }, [])

  const fetchMe = useCallback(async (token) => {
    try {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`
      const res = await api.get('/auth/me')
      const userData = res.data?.data?.user || res.data?.data || res.data
      setUser(userData)
      return userData
    } catch {
      return null
    }
  }, [])

  // On mount: try to refresh
  useEffect(() => {
    const init = async () => {
      const storedRT = localStorage.getItem('refreshToken')
      if (!storedRT) {
        setLoading(false)
        return
      }
      try {
        const res = await authApi.refresh(storedRT)
        const newAT = res.accessToken
        if (res.refreshToken) localStorage.setItem('refreshToken', res.refreshToken)
        updateToken(newAT)
        await fetchMe(newAT)
      } catch {
        localStorage.removeItem('refreshToken')
      } finally {
        setLoading(false)
      }
    }
    init()
  }, [fetchMe, updateToken])

  const login = async (email, password) => {
    const res = await authApi.login(email, password)
    const { accessToken: token, refreshToken: rt, user: userData } = res
    updateToken(token)
    if (rt) localStorage.setItem('refreshToken', rt)
    setUser(userData)
    return userData
  }

  const register = async (name, email, password) => {
    const res = await authApi.register(name, email, password)
    const { accessToken: token, refreshToken: rt, user: userData } = res
    updateToken(token)
    if (rt) localStorage.setItem('refreshToken', rt)
    setUser(userData)
    return userData
  }

  const logout = async () => {
    const rt = localStorage.getItem('refreshToken')
    try { await authApi.logout(rt) } catch {}
    updateToken(null)
    setAccessToken(null)
    setUser(null)
    localStorage.removeItem('refreshToken')
  }

  const refreshToken = async () => {
    const rt = localStorage.getItem('refreshToken')
    if (!rt) { await logout(); return null }
    try {
      const res = await authApi.refresh(rt)
      const newAT = res.accessToken
      if (res.refreshToken) localStorage.setItem('refreshToken', res.refreshToken)
      updateToken(newAT)
      return newAT
    } catch {
      await logout()
      return null
    }
  }

  return (
    <AuthContext.Provider value={{ user, accessToken, loading, login, register, logout, refreshToken, setUser }}>
      {children}
    </AuthContext.Provider>
  )
}
