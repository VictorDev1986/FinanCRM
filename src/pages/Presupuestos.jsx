import { useEffect, useMemo, useState } from 'react'
import { financeService } from '../api/financeService.js'
import { expenseCategories } from '../app/constants.js'
import FormField from '../components/FormField.jsx'
import SectionHeader from '../components/SectionHeader.jsx'
import { useAuth } from '../features/auth/AuthProvider.jsx'
import { formatCurrency } from '../utils/format.js'
import { monthKeyFromDate, parseAmount } from '../utils/finance.js'
import { notify } from '../utils/notify.js'

const emptyForm = {
  categoria: '',
  limite: '',
  mes: new Date().toISOString().slice(0, 7),
}

export default function Presupuestos() {
  const { session } = useAuth()
  const [budgets, setBudgets] = useState([])
  const [expenses, setExpenses] = useState([])
  const [form, setForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(true)

  const loadData = async () => {
    setLoading(true)
    try {
      const [budgetRows, expenseRows] = await Promise.all([
        financeService.listBudgets(session?.email || ''),
        financeService.listExpenses(session?.email || ''),
      ])
      setBudgets(budgetRows)
      setExpenses(expenseRows)
    } catch (error) {
      notify.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (session?.email) {
      loadData()
    }
  }, [session?.email])

  const currentMonthKey = monthKeyFromDate(new Date())

  const spentByCategory = useMemo(() => {
    const totals = {}
    expenses.forEach((expense) => {
      if (monthKeyFromDate(expense.fecha) !== currentMonthKey) return
      const category = expense.categoria || 'Otros'
      totals[category] = (totals[category] || 0) + parseAmount(expense.monto)
    })
    return totals
  }, [expenses, currentMonthKey])

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (!form.categoria || !form.limite || !form.mes) {
      notify.error('Completa todos los campos')
      return
    }
    setSaving(true)
    try {
      await financeService.createBudget({
        budget: {
          ...form,
          usuario: session?.email || '',
        },
      })
      setForm({ ...emptyForm, mes: form.mes })
      await loadData()
      notify.success('Presupuesto guardado')
    } catch (error) {
      notify.error(error.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      <SectionHeader title="Presupuestos mensuales" subtitle="Presupuestos" />
      <form
        className="grid gap-4 rounded-xl border border-slate-800/50 bg-slate-950/60 p-5 shadow-soft"
        onSubmit={handleSubmit}
      >
        <div className="grid gap-4 lg:grid-cols-3">
          <FormField label="Categoria">
            <select
              className="input"
              value={form.categoria}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, categoria: event.target.value }))
              }
              required
            >
              <option value="">Selecciona</option>
              {expenseCategories.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </FormField>
          <FormField label="Limite">
            <input
              className="input"
              type="number"
              step="0.01"
              value={form.limite}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, limite: event.target.value }))
              }
              placeholder="0.00"
              required
            />
          </FormField>
          <FormField label="Mes">
            <input
              className="input"
              type="month"
              value={form.mes}
              onChange={(event) => setForm((prev) => ({ ...prev, mes: event.target.value }))}
              required
            />
          </FormField>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <button className="btn-primary" type="submit" disabled={saving}>
            {saving ? 'Guardando...' : 'Guardar presupuesto'}
          </button>
          <button
            className="btn-ghost"
            type="button"
            onClick={() => setForm({ ...emptyForm, mes: form.mes })}
            disabled={saving}
          >
            Limpiar
          </button>
        </div>
      </form>
      <div className="grid gap-4">
        {loading ? <p className="text-sm text-slate-400">Cargando presupuestos...</p> : null}
        {budgets.length ? (
          budgets.map((budget) => {
            const spent = spentByCategory[budget.categoria] || 0
            const limit = parseAmount(budget.limite)
            const percent = limit ? Math.min((spent / limit) * 100, 100) : 0
            return (
              <div
                key={budget.id || budget.categoria}
                className="rounded-xl border border-slate-800/50 bg-slate-950/60 p-5 shadow-soft"
              >
                <div className="flex items-center justify-between text-sm text-slate-200">
                  <span>{budget.categoria}</span>
                  <span>
                    {formatCurrency(spent)} / {formatCurrency(limit)}
                  </span>
                </div>
                <div className="mt-3 h-2 rounded-full bg-slate-800">
                  <div
                    className="h-2 rounded-full bg-emerald-400"
                    style={{ width: `${percent}%` }}
                  ></div>
                </div>
                <p className="mt-2 text-xs text-slate-500">{Math.round(percent)}% usado</p>
              </div>
            )
          })
        ) : (
          <p className="text-sm text-slate-500">Sin presupuestos registrados.</p>
        )}
      </div>
    </div>
  )
}
