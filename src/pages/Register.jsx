import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { authService } from '../features/auth/authService.js'
import { isEmail, isStrongPassword } from '../utils/validators.js'
import { notify } from '../utils/notify.js'

export default function Register() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ nombre: '', email: '', password: '' })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (!form.nombre.trim()) {
      notify.error('Nombre requerido')
      return
    }
    if (!isEmail(form.email)) {
      notify.error('Correo invalido')
      return
    }
    if (!isStrongPassword(form.password)) {
      notify.error('Contrasena muy corta')
      return
    }

    setLoading(true)
    try {
      await authService.register(form)
      notify.success('Cuenta creada')
      navigate('/login')
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
              Crea tu cuenta
            </h1>
            <p className="mt-3 text-slate-400">
              Registra tus datos para ingresar al panel financiero.
            </p>
            <form className="mt-8 grid gap-4" onSubmit={handleSubmit}>
              <label className="grid gap-2 text-sm text-slate-300">
                Nombre
                <input
                  className="input"
                  type="text"
                  value={form.nombre}
                  onChange={(event) =>
                    setForm((prev) => ({ ...prev, nombre: event.target.value }))
                  }
                  placeholder="Nombre completo"
                  required
                />
              </label>
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
                {loading ? 'Creando...' : 'Crear cuenta'}
              </button>
            </form>
            <p className="mt-6 text-sm text-slate-400">
              Ya tienes cuenta?{' '}
              <Link to="/login" className="text-emerald-300 hover:text-emerald-200">
                Inicia sesion
              </Link>
            </p>
          </div>
          <div className="space-y-4 text-sm text-slate-300">
            <div className="rounded-xl border border-slate-800/40 bg-slate-950/60 p-6 shadow-soft">
              <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Notas</p>
              <ul className="mt-3 space-y-2">
                <li>Tu cuenta se guarda en la hoja Usuarios.</li>
                <li>La contrasena se guarda tal cual.</li>
                <li>No compartas tu acceso.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
