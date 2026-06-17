import { supabase } from '../lib/supabase.js'

const tables = {
  income: 'ingresos',
  expenses: 'gastos',
  budgets: 'presupuestos',
  goals: 'metas',
  debts: 'deudas',
}

export const financeService = {
  async listIncome(usuarioId) {
    const { data, error } = await supabase
      .from(tables.income)
      .select('*')
      .eq('usuario_id', usuarioId)
      .order('fecha', { ascending: false })
    if (error) throw error
    return data || []
  },

  async createIncome(payload) {
    const { data, error } = await supabase
      .from(tables.income)
      .insert([{
        usuario_id: payload.income.usuario,
        fecha: payload.income.fecha,
        categoria: payload.income.categoria,
        descripcion: payload.income.descripcion,
        metodo_pago: payload.income.metodo_pago,
        monto: parseFloat(payload.income.monto) || 0,
      }])
      .select()
    if (error) throw error
    return data
  },

  async listExpenses(usuarioId) {
    const { data, error } = await supabase
      .from(tables.expenses)
      .select('*')
      .eq('usuario_id', usuarioId)
      .order('fecha', { ascending: false })
    if (error) throw error
    return data || []
  },

  async createExpense(payload) {
    const { data, error } = await supabase
      .from(tables.expenses)
      .insert([{
        usuario_id: payload.expense.usuario,
        fecha: payload.expense.fecha,
        categoria: payload.expense.categoria,
        descripcion: payload.expense.descripcion,
        metodo_pago: payload.expense.metodo_pago,
        monto: parseFloat(payload.expense.monto) || 0,
      }])
      .select()
    if (error) throw error
    return data
  },

  async listBudgets(usuarioId) {
    const { data, error } = await supabase
      .from(tables.budgets)
      .select('*')
      .eq('usuario_id', usuarioId)
      .order('created_at', { ascending: false })
    if (error) throw error
    return data || []
  },

  async createBudget(payload) {
    const { data, error } = await supabase
      .from(tables.budgets)
      .insert([{
        usuario_id: payload.budget.usuario,
        categoria: payload.budget.categoria,
        limite: parseFloat(payload.budget.limite) || 0,
        mes: payload.budget.mes,
      }])
      .select()
    if (error) throw error
    return data
  },

  async listGoals(usuarioId) {
    const { data, error } = await supabase
      .from(tables.goals)
      .select('*')
      .eq('usuario_id', usuarioId)
      .order('created_at', { ascending: false })
    if (error) throw error
    return data || []
  },

  async createGoal(payload) {
    const { data, error } = await supabase
      .from(tables.goals)
      .insert([{
        usuario_id: payload.goal.usuario,
        nombre: payload.goal.nombre,
        objetivo: parseFloat(payload.goal.objetivo) || 0,
        actual: parseFloat(payload.goal.actual) || 0,
        fecha_objetivo: payload.goal.fecha_objetivo,
      }])
      .select()
    if (error) throw error
    return data
  },

  async listDebts(usuarioId) {
    const { data, error } = await supabase
      .from(tables.debts)
      .select('*')
      .eq('usuario_id', usuarioId)
      .order('created_at', { ascending: false })
    if (error) throw error
    return data || []
  },

  async createDebt(payload) {
    const { data, error } = await supabase
      .from(tables.debts)
      .insert([{
        usuario_id: payload.debt.usuario,
        nombre: payload.debt.nombre,
        saldo: parseFloat(payload.debt.saldo) || 0,
        interes: parseFloat(payload.debt.interes) || 0,
        fecha_limite: payload.debt.fecha_limite,
        estado: payload.debt.estado || 'Activo',
      }])
      .select()
    if (error) throw error
    return data
  },
}
