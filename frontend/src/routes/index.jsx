import React, { lazy, Suspense } from 'react'
import { createBrowserRouter } from 'react-router-dom'
import { RequireAuth, RequireAdmin, RequireGuest } from './guards'
import { PageLoader } from '../components/common/LoadingSpinner'
import PublicLayout from '../layouts/PublicLayout'
import ClientLayout from '../layouts/ClientLayout'
import AdminLayout from '../layouts/AdminLayout'

const L = (imp) => {
  const C = lazy(imp)
  return (
    <Suspense fallback={<PageLoader />}>
      <C />
    </Suspense>
  )
}

const LoginPage = () => L(() => import('../pages/auth/LoginPage'))
const RegisterPage = () => L(() => import('../pages/auth/RegisterPage'))
const HomePage = () => L(() => import('../pages/client/HomePage'))
const GamesListPage = () => L(() => import('../pages/client/GamesListPage'))
const GameDetailPage = () => L(() => import('../pages/client/GameDetailPage'))
const GamePlayPage = () => L(() => import('../pages/client/GamePlayPage'))
const ProfilePage = () => L(() => import('../pages/client/ProfilePage'))
const FriendsPage = () => L(() => import('../pages/client/FriendsPage'))
const MessagesPage = () => L(() => import('../pages/client/MessagesPage'))
const AchievementsPage = () => L(() => import('../pages/client/AchievementsPage'))
const RankingsPage = () => L(() => import('../pages/client/RankingsPage'))
const SettingsPage = () => L(() => import('../pages/client/SettingsPage'))
const AdminDashboardPage = () => L(() => import('../pages/admin/AdminDashboardPage'))
const AdminUsersPage = () => L(() => import('../pages/admin/AdminUsersPage'))
const AdminGamesPage = () => L(() => import('../pages/admin/AdminGamesPage'))
const AdminStatsPage = () => L(() => import('../pages/admin/AdminStatsPage'))

const router = createBrowserRouter([
  {
    element: <PublicLayout />,
    children: [
      { path: '/login', element: <RequireGuest>{LoginPage()}</RequireGuest> },
      { path: '/register', element: <RequireGuest>{RegisterPage()}</RequireGuest> },
    ]
  },
  {
    element: <RequireAuth><ClientLayout /></RequireAuth>,
    children: [
      { path: '/', element: HomePage() },
      { path: '/games', element: GamesListPage() },
      { path: '/games/:slug', element: GameDetailPage() },
      { path: '/games/:slug/play', element: GamePlayPage() },
      { path: '/profile', element: ProfilePage() },
      { path: '/friends', element: FriendsPage() },
      { path: '/messages', element: MessagesPage() },
      { path: '/achievements', element: AchievementsPage() },
      { path: '/rankings', element: RankingsPage() },
      { path: '/settings', element: SettingsPage() },
    ]
  },
  {
    element: <RequireAdmin><AdminLayout /></RequireAdmin>,
    children: [
      { path: '/admin', element: AdminDashboardPage() },
      { path: '/admin/users', element: AdminUsersPage() },
      { path: '/admin/games', element: AdminGamesPage() },
      { path: '/admin/stats', element: AdminStatsPage() },
    ]
  }
])

export default router
