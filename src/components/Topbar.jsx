import { useAuth } from '../features/auth/AuthProvider.jsx'
import { notify } from '../utils/notify.js'

export default function Topbar({ onMenuToggle }) {
  const { session, logout } = useAuth()

  return (
    <header className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-slate-800/40 bg-slate-950/60 p-5 shadow-soft">
      <div className="flex items-center gap-3">
        <button
          type="button"
          className="btn-ghost lg:hidden"
          onClick={onMenuToggle}
          aria-label="Abrir menu"
        >
          ☰
        </button>
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Panel</p>
          <h2 className="text-lg font-semibold text-slate-100">
            Bienvenido, {session?.name || 'Usuario'}
          </h2>
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          className="btn-ghost"
          onClick={() => notify.info('Sincronizando datos...')}
        >
          Sincronizar
        </button>
        <button type="button" className="btn-primary" onClick={logout}>
          Salir
        </button>
      </div>
    </header>
  )
}
