import { useEffect, useMemo, useState } from 'react'
import { financeService } from '../api/financeService.js'
import DataTable from '../components/DataTable.jsx'
import FormField from '../components/FormField.jsx'
import SectionHeader from '../components/SectionHeader.jsx'
import { incomeCategories, paymentMethods } from '../app/constants.js'
import { useAuth } from '../features/auth/AuthProvider.jsx'
import { formatCurrency } from '../utils/format.js'
import { notify } from '../utils/notify.js'

const emptyForm = {
  fecha: '',
  categoria: '',
  descripcion: '',
  metodo_pago: '',
  monto: '',
}

export default function Ingresos() {
  const { session } = useAuth()
  const [rows, setRows] = useState([])
  const [query, setQuery] = useState('')
  const [form, setForm] = useState(emptyForm)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const filtered = useMemo(() => {
    const q = query.toLowerCase()
    return rows.filter((row) =>
      String(row.descripcion || row.description || '')
        .toLowerCase()
        .includes(q)
    )
  }, [rows, query])

  const tableRows = filtered.map((row, index) => ({
    id: row.id || `${row.fecha}-${row.descripcion}-${index}`,
    cells: [
      row.fecha || row.date,
      row.categoria || row.category,
      row.descripcion || row.description,
      row.metodo_pago || row.method,
      formatCurrency(row.monto || row.amount),
    ],
  }))

  const loadRows = async () => {
    setLoading(true)
    try {
      const data = await financeService.listIncome(session?.user?.id || '')
      setRows(data)
    } catch (error) {
      notify.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (session?.user?.id) {
      loadRows()
    }
  }, [session?.user?.id])

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (!form.fecha || !form.categoria || !form.descripcion || !form.metodo_pago || !form.monto) {
      notify.error('Completa todos los campos')
      return
    }

    setSaving(true)
    try {
      await financeService.createIncome({
        income: {
          ...form,
          usuario: session?.user?.id || '',
        },
      })
      setForm(emptyForm)
      await loadRows()
      notify.success('Ingreso guardado')
    } catch (error) {
      notify.error(error.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Gestion de ingresos"
        subtitle="Ingresos"
      />
      <form
        className="grid gap-4 rounded-xl border border-slate-800/50 bg-slate-950/60 p-5 shadow-soft"
        onSubmit={handleSubmit}
      >
        <div className="grid gap-4 lg:grid-cols-3">
          <FormField label="Fecha">
            <input
              className="input"
              type="date"
              value={form.fecha}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, fecha: event.target.value }))
              }
              required
            />
          </FormField>
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
              {incomeCategories.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </FormField>
          <FormField label="Metodo">
            <select
              className="input"
              value={form.metodo_pago}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, metodo_pago: event.target.value }))
              }
              required
            >
              <option value="">Selecciona</option>
              {paymentMethods.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </FormField>
        </div>
        <div className="grid gap-4 lg:grid-cols-2">
          <FormField label="Descripcion">
            <input
              className="input"
              value={form.descripcion}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, descripcion: event.target.value }))
              }
              placeholder="Detalle del ingreso"
              required
            />
          </FormField>
          <FormField label="Monto">
            <input
              className="input"
              type="number"
              step="0.01"
              value={form.monto}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, monto: event.target.value }))
              }
              placeholder="0.00"
              required
            />
          </FormField>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <button className="btn-primary" type="submit" disabled={saving}>
            {saving ? 'Guardando...' : 'Guardar ingreso'}
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
      <div className="grid gap-4 rounded-xl border border-slate-800/50 bg-slate-950/60 p-5 shadow-soft">
        <FormField label="Buscar">
          <input
            className="input"
            placeholder="Buscar por descripcion"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </FormField>
      </div>
      {loading ? (
        <p className="text-sm text-slate-400">Cargando ingresos...</p>
      ) : null}
      <DataTable
        columns={['Fecha', 'Categoria', 'Descripcion', 'Metodo', 'Monto']}
        rows={tableRows}
      />
    </div>
  )
}
