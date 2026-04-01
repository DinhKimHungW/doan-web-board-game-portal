import React from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from '../components/layout/Navbar'
import Sidebar from '../components/layout/Sidebar'
import Footer from '../components/layout/Footer'

export default function ClientLayout() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="flex flex-1">
        <div className="hidden lg:block">
          <Sidebar />
        </div>
        <main className="flex-1 overflow-auto">
          <Outlet />
        </main>
      </div>
      <Footer />
    </div>
  )
}
