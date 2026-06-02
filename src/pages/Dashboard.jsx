import { useEffect, useMemo, useState } from 'react'
import { financeService } from '../api/financeService.js'
import ChartCard from '../components/ChartCard.jsx'
import DataTable from '../components/DataTable.jsx'
import Loading from '../components/Loading.jsx'
import SectionHeader from '../components/SectionHeader.jsx'
import StatCard from '../components/StatCard.jsx'
import { useAuth } from '../features/auth/AuthProvider.jsx'
import { formatCurrency } from '../utils/format.js'
import { notify } from '../utils/notify.js'
import {
  buildMonthlyTotals,
  calcTrend,
  parseAmount,
  sumByCategory,
  sumRows,
} from '../utils/finance.js'

export default function Dashboard() {
  const { session } = useAuth()
  const [incomeRows, setIncomeRows] = useState([])
  const [expenseRows, setExpenseRows] = useState([])
  const [budgets, setBudgets] = useState([])
  const [goals, setGoals] = useState([])
  const [debts, setDebts] = useState([])
  const [loading, setLoading] = useState(true)

  const loadData = async () => {
    setLoading(true)
    try {
      const [income, expenses, budgetRows, goalRows, debtRows] = await Promise.all([
        financeService.listIncome(session?.email || ''),
        financeService.listExpenses(session?.email || ''),
        financeService.listBudgets(session?.email || ''),
        financeService.listGoals(session?.email || ''),
        financeService.listDebts(session?.email || ''),
      ])
      setIncomeRows(income)
      setExpenseRows(expenses)
      setBudgets(budgetRows)
      setGoals(goalRows)
      setDebts(debtRows)
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

  const incomeSeries = useMemo(() => {
    return buildMonthlyTotals(incomeRows, 6, (row) => row.fecha, (row) => row.monto)
  }, [incomeRows])

  const expenseSeries = useMemo(() => {
    return buildMonthlyTotals(expenseRows, 6, (row) => row.fecha, (row) => row.monto)
  }, [expenseRows])

  const currentMonthKey = incomeSeries.keys[incomeSeries.keys.length - 1]
  const prevMonthKey = incomeSeries.keys[incomeSeries.keys.length - 2]

  const currentIncome = incomeSeries.totals[currentMonthKey] || 0
  const prevIncome = incomeSeries.totals[prevMonthKey] || 0
  const currentExpense = expenseSeries.totals[currentMonthKey] || 0
  const prevExpense = expenseSeries.totals[prevMonthKey] || 0

  const balanceTotal = sumRows(incomeRows, (row) => row.monto) - sumRows(expenseRows, (row) => row.monto)
  const prevBalance = prevIncome - prevExpense
  const currentSavings = currentIncome - currentExpense
  const prevSavings = prevIncome - prevExpense

  const kpis = [
    {
      id: 'balance',
      label: 'Balance total',
      value: balanceTotal,
      trend: calcTrend(prevBalance, balanceTotal),
    },
    {
      id: 'income',
      label: 'Ingresos del mes',
      value: currentIncome,
      trend: calcTrend(prevIncome, currentIncome),
    },
    {
      id: 'expense',
      label: 'Gastos del mes',
      value: currentExpense,
      trend: calcTrend(prevExpense, currentExpense),
    },
    {
      id: 'savings',
      label: 'Ahorros',
      value: currentSavings,
      trend: calcTrend(prevSavings, currentSavings),
    },
  ]

  const incomeChart = {
    labels: incomeSeries.labels,
    datasets: [
      {
        label: 'Ingresos',
        data: incomeSeries.data,
        borderColor: '#34d399',
        backgroundColor: 'rgba(52, 211, 153, 0.2)',
        tension: 0.35,
        fill: true,
      },
    ],
  }

  const expenseCategoryTotals = sumByCategory(
    expenseRows,
    (row) => row.fecha,
    (row) => row.categoria,
    (row) => row.monto,
    currentMonthKey
  )

  const expenseChart = {
    labels: expenseCategoryTotals.labels,
    datasets: [
      {
        label: 'Gastos',
        data: expenseCategoryTotals.data,
        backgroundColor: [
          '#38bdf8',
          '#f97316',
          '#fb7185',
          '#22c55e',
          '#eab308',
          '#a855f7',
          '#14b8a6',
          '#f59e0b',
        ],
      },
    ],
  }

  const budgetStatus = budgets.map((budget) => {
    const spent = expenseCategoryTotals.totals[budget.categoria] || 0
    return {
      id: budget.id || budget.categoria,
      label: budget.categoria,
      spent,
      limit: parseAmount(budget.limite),
    }
  })

  const movementRows = useMemo(() => {
    const incomeMovements = incomeRows.map((row) => ({
      id: row.id || `${row.fecha}-${row.descripcion}`,
      date: row.fecha,
      description: row.descripcion,
      category: row.categoria,
      method: row.metodo_pago,
      amount: parseAmount(row.monto),
    }))
    const expenseMovements = expenseRows.map((row) => ({
      id: row.id || `${row.fecha}-${row.descripcion}`,
      date: row.fecha,
      description: row.descripcion,
      category: row.categoria,
      method: row.metodo_pago,
      amount: -parseAmount(row.monto),
    }))

    return [...incomeMovements, ...expenseMovements]
      .sort((a, b) => {
        const aDate = new Date(a.date).getTime()
        const bDate = new Date(b.date).getTime()
        return bDate - aDate
      })
      .slice(0, 8)
      .map((movement) => ({
        id: movement.id,
        cells: [
          movement.date,
          movement.description,
          movement.category,
          movement.method,
          formatCurrency(movement.amount),
        ],
      }))
  }, [incomeRows, expenseRows])

  return (
    <div className="space-y-8">
      <SectionHeader title="Resumen financiero" subtitle="Dashboard" />
      {loading ? <Loading label="Cargando datos" /> : null}
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {kpis.map((kpi) => (
          <StatCard key={kpi.id} {...kpi} />
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <ChartCard
          title="Ingresos mensuales"
          subtitle="Flujo"
          data={incomeChart}
          options={{
            plugins: { legend: { display: false } },
            scales: { y: { ticks: { color: '#94a3b8' } }, x: { ticks: { color: '#94a3b8' } } },
          }}
        />
        <ChartCard
          title="Distribucion de gastos"
          subtitle="Categorias"
          type="doughnut"
          data={expenseChart}
          options={{ plugins: { legend: { position: 'bottom', labels: { color: '#94a3b8' } } } }}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="rounded-xl border border-slate-800/50 bg-slate-950/60 p-5 shadow-soft">
          <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Presupuestos</p>
          <div className="mt-4 space-y-4">
            {budgetStatus.length ? (
              budgetStatus.map((budget) => {
                const percent = budget.limit
                  ? Math.min((budget.spent / budget.limit) * 100, 100)
                  : 0
                return (
                  <div key={budget.id}>
                    <div className="flex items-center justify-between text-sm text-slate-200">
                      <span>{budget.label}</span>
                      <span>{Math.round(percent)}%</span>
                    </div>
                    <div className="mt-2 h-2 rounded-full bg-slate-800">
                      <div
                        className="h-2 rounded-full bg-emerald-400"
                        style={{ width: `${percent}%` }}
                      ></div>
                    </div>
                  </div>
                )
              })
            ) : (
              <p className="text-sm text-slate-500">Sin presupuestos registrados.</p>
            )}
          </div>
        </div>
        <div className="rounded-xl border border-slate-800/50 bg-slate-950/60 p-5 shadow-soft">
          <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Metas</p>
          <div className="mt-4 space-y-4 text-sm text-slate-300">
            {goals.length ? (
              goals.map((goal) => {
                const saved = parseAmount(goal.actual)
                const target = parseAmount(goal.objetivo)
                const percent = target ? (saved / target) * 100 : 0
                return (
                  <div key={goal.id} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-200">{goal.nombre}</span>
                      <span>
                        {formatCurrency(saved)} / {formatCurrency(target)}
                      </span>
                    </div>
                    <div className="h-2 rounded-full bg-slate-800">
                      <div
                        className="h-2 rounded-full bg-sky-400"
                        style={{ width: `${percent}%` }}
                      ></div>
                    </div>
                  </div>
                )
              })
            ) : (
              <p className="text-sm text-slate-500">Sin metas registradas.</p>
            )}
          </div>
        </div>
        <div className="rounded-xl border border-slate-800/50 bg-slate-950/60 p-5 shadow-soft">
          <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Deudas</p>
          <div className="mt-4 space-y-4 text-sm text-slate-300">
            {debts.length ? (
              debts.map((debt) => (
                <div key={debt.id} className="rounded-lg border border-slate-800/50 p-3">
                  <p className="text-slate-200">{debt.nombre}</p>
                  <p className="mt-1">Pendiente: {formatCurrency(debt.saldo)}</p>
                  <p className="text-xs text-slate-500">Vence: {debt.fecha_limite}</p>
                </div>
              ))
            ) : (
              <p className="text-sm text-slate-500">Sin deudas registradas.</p>
            )}
          </div>
        </div>
      </div>

      <SectionHeader title="Ultimos movimientos" subtitle="Actividad" />
      <DataTable
        columns={['Fecha', 'Descripcion', 'Categoria', 'Metodo', 'Monto']}
        rows={movementRows}
      />
    </div>
  )
}
