import { useEffect, useState } from 'react'
import { financeService } from '../api/financeService.js'
import FormField from '../components/FormField.jsx'
import SectionHeader from '../components/SectionHeader.jsx'
import { useAuth } from '../features/auth/AuthProvider.jsx'
import { formatCurrency } from '../utils/format.js'
import { parseAmount } from '../utils/finance.js'
import { notify } from '../utils/notify.js'

const emptyForm = {
  nombre: '',
  objetivo: '',
  actual: '',
  fecha_objetivo: '',
}

export default function Metas() {
  const { session } = useAuth()
  const [goals, setGoals] = useState([])
  const [form, setForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(true)

  const loadGoals = async () => {
    setLoading(true)
    try {
      const data = await financeService.listGoals(session?.email || '')
      setGoals(data)
    } catch (error) {
      notify.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (session?.email) {
      loadGoals()
    }
  }, [session?.email])

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (!form.nombre || !form.objetivo || !form.fecha_objetivo) {
      notify.error('Completa los campos requeridos')
      return
    }

    setSaving(true)
    try {
      await financeService.createGoal({
        goal: {
          ...form,
          actual: form.actual || 0,
          usuario: session?.email || '',
        },
      })
      setForm(emptyForm)
      await loadGoals()
      notify.success('Meta guardada')
    } catch (error) {
      notify.error(error.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      <SectionHeader title="Metas de ahorro" subtitle="Metas" />
      <form
        className="grid gap-4 rounded-xl border border-slate-800/50 bg-slate-950/60 p-5 shadow-soft"
        onSubmit={handleSubmit}
      >
        <div className="grid gap-4 lg:grid-cols-2">
          <FormField label="Nombre">
            <input
              className="input"
              value={form.nombre}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, nombre: event.target.value }))
              }
              placeholder="Meta de ahorro"
              required
            />
          </FormField>
          <FormField label="Fecha objetivo">
            <input
              className="input"
              type="date"
              value={form.fecha_objetivo}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, fecha_objetivo: event.target.value }))
              }
              required
            />
          </FormField>
        </div>
        <div className="grid gap-4 lg:grid-cols-2">
          <FormField label="Objetivo">
            <input
              className="input"
              type="number"
              step="0.01"
              value={form.objetivo}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, objetivo: event.target.value }))
              }
              placeholder="0.00"
              required
            />
          </FormField>
          <FormField label="Ahorro actual">
            <input
              className="input"
              type="number"
              step="0.01"
              value={form.actual}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, actual: event.target.value }))
              }
              placeholder="0.00"
            />
          </FormField>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <button className="btn-primary" type="submit" disabled={saving}>
            {saving ? 'Guardando...' : 'Guardar meta'}
          </button>
          <button
            className="btn-ghost"
            type="button"
            onClick={() => setForm(emptyForm)}
            disabled={saving}
          >
            Limpiar
          </button>
        </div>
      </form>
      <div className="grid gap-4 lg:grid-cols-2">
        {loading ? <p className="text-sm text-slate-400">Cargando metas...</p> : null}
        {goals.length ? (
          goals.map((goal) => {
            const saved = parseAmount(goal.actual)
            const target = parseAmount(goal.objetivo)
            const percent = target ? Math.round((saved / target) * 100) : 0
            return (
              <div
                key={goal.id || goal.nombre}
                className="rounded-xl border border-slate-800/50 bg-slate-950/60 p-5 shadow-soft"
              >
                <div className="flex items-center justify-between text-sm text-slate-200">
                  <span>{goal.nombre}</span>
                  <span>{percent}%</span>
                </div>
                <p className="mt-3 text-2xl font-semibold text-slate-100">
                  {formatCurrency(saved)}
                </p>
                <p className="text-xs text-slate-500">Meta: {formatCurrency(target)}</p>
                <div className="mt-3 h-2 rounded-full bg-slate-800">
                  <div
                    className="h-2 rounded-full bg-sky-400"
                    style={{ width: `${percent}%` }}
                  ></div>
                </div>
                <p className="mt-2 text-xs text-slate-500">
                  Objetivo: {goal.fecha_objetivo}
                </p>
              </div>
            )
          })
        ) : (
          <p className="text-sm text-slate-500">Sin metas registradas.</p>
        )}
      </div>
    </div>
  )
}
