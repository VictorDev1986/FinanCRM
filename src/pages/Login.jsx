import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../features/auth/AuthProvider.jsx'
import { isEmail, isMinLength } from '../utils/validators.js'
import { notify } from '../utils/notify.js'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (!isEmail(form.email)) {
      notify.error('Correo invalido')
      return
    }
    if (!isMinLength(form.password)) {
      notify.error('Contrasena muy corta')
      return
    }

    setLoading(true)
    try {
      await login(form)
      notify.success('Bienvenido')
      navigate('/')
    } catch (error) {
      notify.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-auth">
      <div className="mx-auto flex min-h-screen max-w-5xl items-center justify-center px-4">
        <div className="grid w-full gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-xl border border-slate-800/40 bg-slate-950/70 p-8 shadow-glow">
            <p className="text-xs uppercase tracking-[0.3em] text-emerald-400">FinanCRM</p>
            <h1 className="mt-4 text-3xl font-semibold text-slate-100">
              Controla tu dinero con claridad
            </h1>
            <p className="mt-3 text-slate-400">
              Accede a tu panel financiero, analiza gastos y automatiza facturas.
            </p>
            <form className="mt-8 grid gap-4" onSubmit={handleSubmit}>
              <label className="grid gap-2 text-sm text-slate-300">
                Correo
                <input
                  className="input"
                  type="email"
                  value={form.email}
                  onChange={(event) =>
                    setForm((prev) => ({ ...prev, email: event.target.value }))
                  }
                  placeholder="correo@empresa.com"
                  required
                />
              </label>
              <label className="grid gap-2 text-sm text-slate-300">
                Contrasena
                <input
                  className="input"
                  type="password"
                  value={form.password}
                  onChange={(event) =>
                    setForm((prev) => ({ ...prev, password: event.target.value }))
                  }
                  placeholder="******"
                  required
                />
              </label>
              <button type="submit" className="btn-primary" disabled={loading}>
                {loading ? 'Ingresando...' : 'Ingresar'}
              </button>
            </form>
            <p className="mt-6 text-sm text-slate-400">
              No tienes cuenta?{' '}
              <Link to="/register" className="text-emerald-300 hover:text-emerald-200">
                Crear cuenta
              </Link>
            </p>
          </div>
          <div className="space-y-4 text-sm text-slate-300">
            <div className="rounded-xl border border-slate-800/40 bg-slate-950/60 p-6 shadow-soft">
              <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Funcionalidades</p>
              <ul className="mt-3 space-y-2">
                <li>Dashboard con KPIs financieros</li>
                <li>Gestion de ingresos y gastos</li>
                <li>Presupuestos y metas de ahorro</li>
                <li>IA para facturas y clasificacion</li>
              </ul>
            </div>
            <div className="rounded-xl border border-slate-800/40 bg-slate-950/60 p-6 shadow-soft">
              <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Acceso rapido</p>
              <p className="mt-3">Inicia sesion con tu correo y contrasena.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
