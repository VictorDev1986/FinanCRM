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
  saldo: '',
  interes: '',
  fecha_limite: '',
  estado: 'Activo',
}

export default function Deudas() {
  const { session } = useAuth()
  const [debts, setDebts] = useState([])
  const [form, setForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(true)

  const loadDebts = async () => {
    setLoading(true)
    try {
      const data = await financeService.listDebts(session?.email || '')
      setDebts(data)
    } catch (error) {
      notify.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (session?.email) {
      loadDebts()
    }
  }, [session?.email])

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (!form.nombre || !form.saldo || !form.fecha_limite) {
      notify.error('Completa los campos requeridos')
      return
    }

    setSaving(true)
    try {
      await financeService.createDebt({
        debt: {
          ...form,
          usuario: session?.email || '',
        },
      })
      setForm(emptyForm)
      await loadDebts()
      notify.success('Deuda guardada')
    } catch (error) {
      notify.error(error.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      <SectionHeader title="Deudas y prestamos" subtitle="Deudas" />
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
              placeholder="Nombre de la deuda"
              required
            />
          </FormField>
          <FormField label="Fecha limite">
            <input
              className="input"
              type="date"
              value={form.fecha_limite}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, fecha_limite: event.target.value }))
              }
              required
            />
          </FormField>
        </div>
        <div className="grid gap-4 lg:grid-cols-3">
          <FormField label="Saldo">
            <input
              className="input"
              type="number"
              step="0.01"
              value={form.saldo}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, saldo: event.target.value }))
              }
              placeholder="0.00"
              required
            />
          </FormField>
          <FormField label="Interes (%)">
            <input
              className="input"
              type="number"
              step="0.01"
              value={form.interes}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, interes: event.target.value }))
              }
              placeholder="0.00"
            />
          </FormField>
          <FormField label="Estado">
            <select
              className="input"
              value={form.estado}
              onChange={(event) => setForm((prev) => ({ ...prev, estado: event.target.value }))}
            >
              <option value="Activo">Activo</option>
              <option value="Pagado">Pagado</option>
            </select>
          </FormField>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <button className="btn-primary" type="submit" disabled={saving}>
            {saving ? 'Guardando...' : 'Guardar deuda'}
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
        {loading ? <p className="text-sm text-slate-400">Cargando deudas...</p> : null}
        {debts.length ? (
          debts.map((debt) => (
            <div
              key={debt.id || debt.nombre}
              className="rounded-xl border border-slate-800/50 bg-slate-950/60 p-5 shadow-soft"
            >
              <p className="text-sm text-slate-200">{debt.nombre}</p>
              <p className="mt-3 text-2xl font-semibold text-slate-100">
                {formatCurrency(parseAmount(debt.saldo))}
              </p>
              <p className="text-xs text-slate-500">Interes: {debt.interes || 0}%</p>
              <p className="text-xs text-slate-500">Vence: {debt.fecha_limite}</p>
            </div>
          ))
        ) : (
          <p className="text-sm text-slate-500">Sin deudas registradas.</p>
        )}
      </div>
    </div>
  )
}
