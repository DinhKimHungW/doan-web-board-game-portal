import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { PageLoader } from '../components/common/LoadingSpinner'

export function RequireAuth({ children }) {
  const { user, loading } = useAuth()
  const location = useLocation()
  if (loading) return <PageLoader />
  if (!user) return <Navigate to="/login" state={{ from: location }} replace />
  return children
}

export function RequireAdmin({ children }) {
  const { user, loading } = useAuth()
  const location = useLocation()
  if (loading) return <PageLoader />
  if (!user) return <Navigate to="/login" state={{ from: location }} replace />
  if (user.role !== 'ADMIN') return <Navigate to="/" replace />
  return children
}

export function RequireGuest({ children }) {
  const { user, loading } = useAuth()
  if (loading) return <PageLoader />
  if (user) return <Navigate to="/" replace />
  return children
}
