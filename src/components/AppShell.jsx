import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar.jsx'
import Topbar from './Topbar.jsx'

export default function AppShell() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const handleOpenMenu = () => setIsMenuOpen(true)
  const handleCloseMenu = () => setIsMenuOpen(false)

  return (
    <div className="min-h-screen bg-app">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 px-4 py-6 lg:grid-cols-[260px_1fr]">
        <div className="hidden lg:block">
          <Sidebar />
        </div>
        <div className="space-y-6">
          <Topbar onMenuToggle={handleOpenMenu} />
          <main className="space-y-6">
            <Outlet />
          </main>
        </div>
      </div>

      {isMenuOpen ? (
        <div className="fixed inset-0 z-50 lg:hidden" onClick={handleCloseMenu}>
          <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm" />
          <div
            className="absolute left-0 top-0 h-full w-72 max-w-[85vw] p-4"
            onClick={(event) => event.stopPropagation()}
          >
            <Sidebar onNavigate={handleCloseMenu} showCloseButton />
          </div>
        </div>
      ) : null}
    </div>
  )
}
