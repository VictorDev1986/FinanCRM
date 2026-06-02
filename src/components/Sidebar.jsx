import { NavLink } from 'react-router-dom'
import { navItems } from '../app/routes.jsx'
import { appConfig } from '../app/config.js'

export default function Sidebar({ onNavigate, showCloseButton = false }) {
  return (
    <aside className="rounded-xl border border-slate-800/40 bg-slate-950/60 p-5 shadow-soft">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-emerald-400">CRM</p>
          <h1 className="text-xl font-semibold text-slate-100">
            {appConfig.appName}
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <span className="badge">PRO</span>
          {showCloseButton ? (
            <button
              type="button"
              className="btn-ghost lg:hidden"
              onClick={onNavigate}
              aria-label="Cerrar menu"
            >
              ✕
            </button>
          ) : null}
        </div>
      </div>
      <nav className="mt-8 space-y-2">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `nav-item ${isActive ? 'nav-item-active' : ''}`
            }
            onClick={onNavigate}
          >
            <span className="text-lg">{item.icon}</span>
            <span className="text-sm font-medium">{item.label}</span>
          </NavLink>
        ))}
      </nav>
      <div className="mt-10 rounded-lg border border-slate-800/60 bg-slate-950/70 p-4 text-xs text-slate-400">
        <p className="text-slate-200">IA Facturas</p>
        <p className="mt-2">Automatiza gastos con vision IA y reglas.</p>
      </div>
    </aside>
  )
}
