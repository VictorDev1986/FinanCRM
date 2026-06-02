import { useEffect, useMemo, useState } from 'react'
import jsPDF from 'jspdf'
import * as XLSX from 'xlsx'
import { financeService } from '../api/financeService.js'
import SectionHeader from '../components/SectionHeader.jsx'
import { buildMonthlyTotals, parseAmount } from '../utils/finance.js'
import { notify } from '../utils/notify.js'
import { useAuth } from '../features/auth/AuthProvider.jsx'

export default function Reportes() {
  const { session } = useAuth()
  const [period, setPeriod] = useState('Mensual')
  const [incomeRows, setIncomeRows] = useState([])
  const [expenseRows, setExpenseRows] = useState([])
  const [loading, setLoading] = useState(true)

  const loadRows = async () => {
    setLoading(true)
    try {
      const [income, expenses] = await Promise.all([
        financeService.listIncome(session?.email || ''),
        financeService.listExpenses(session?.email || ''),
      ])
      setIncomeRows(income)
      setExpenseRows(expenses)
    } catch (error) {
      notify.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (session?.email) {
      loadRows()
    }
  }, [session?.email])

  const reportRows = useMemo(() => {
    if (period === 'Mensual') {
      const incomeSeries = buildMonthlyTotals(incomeRows, 6, (row) => row.fecha, (row) => row.monto)
      const expenseSeries = buildMonthlyTotals(expenseRows, 6, (row) => row.fecha, (row) => row.monto)
      return incomeSeries.keys.map((key, index) => ({
        label: incomeSeries.labels[index],
        income: incomeSeries.data[index],
        expense: expenseSeries.data[index],
      }))
    }

    const yearTotals = {}
    incomeRows.forEach((row) => {
      const date = new Date(row.fecha)
      if (Number.isNaN(date.getTime())) return
      const year = String(date.getFullYear())
      yearTotals[year] = yearTotals[year] || { income: 0, expense: 0 }
      yearTotals[year].income += parseAmount(row.monto)
    })
    expenseRows.forEach((row) => {
      const date = new Date(row.fecha)
      if (Number.isNaN(date.getTime())) return
      const year = String(date.getFullYear())
      yearTotals[year] = yearTotals[year] || { income: 0, expense: 0 }
      yearTotals[year].expense += parseAmount(row.monto)
    })

    return Object.keys(yearTotals)
      .sort()
      .map((year) => ({
        label: year,
        income: yearTotals[year].income,
        expense: yearTotals[year].expense,
      }))
  }, [period, incomeRows, expenseRows])

  const handleExportPdf = () => {
    const doc = new jsPDF()
    doc.text(`Reporte ${period}`, 20, 20)
    reportRows.forEach((row, index) => {
      doc.text(`${row.label}: ${row.income} / ${row.expense}`, 20, 40 + index * 10)
    })
    doc.save(`reporte-${period.toLowerCase()}.pdf`)
  }

  const handleExportExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(reportRows)
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Resumen')
    XLSX.writeFile(workbook, `reporte-${period.toLowerCase()}.xlsx`)
  }

  return (
    <div className="space-y-6">
      <SectionHeader title="Reportes" subtitle="Analitica" />
      <div className="rounded-xl border border-slate-800/50 bg-slate-950/60 p-5 shadow-soft">
        <div className="flex flex-wrap items-center gap-4">
          <select
            className="input max-w-[200px]"
            value={period}
            onChange={(event) => setPeriod(event.target.value)}
          >
            <option>Mensual</option>
            <option>Anual</option>
          </select>
          <button className="btn-primary" type="button" onClick={handleExportPdf}>
            Exportar PDF
          </button>
          <button className="btn-ghost" type="button" onClick={handleExportExcel}>
            Exportar Excel
          </button>
          <button
            className="btn-ghost"
            type="button"
            onClick={() => notify.info('Aplica filtros avanzados')}
          >
            Filtros
          </button>
        </div>
      </div>
      <div className="rounded-xl border border-slate-800/50 bg-slate-950/60 p-5 shadow-soft">
        <p className="text-sm text-slate-200">Resumen {period}</p>
        <div className="mt-4 grid gap-4 text-sm text-slate-300">
          {loading ? <p className="text-sm text-slate-400">Cargando reportes...</p> : null}
          {reportRows.map((row) => (
            <div key={row.label} className="flex items-center justify-between">
              <span>{row.label}</span>
              <span>
                Ingresos {row.income} / Gastos {row.expense}
              </span>
            </div>
          ))}
          {!loading && !reportRows.length ? (
            <p className="text-sm text-slate-500">Sin datos para el periodo.</p>
          ) : null}
        </div>
      </div>
    </div>
  )
}
