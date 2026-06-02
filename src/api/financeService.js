import { apiRequest } from './client.js'

export const financeService = {
  async listIncome(usuario) {
    const result = await apiRequest('listIncome', { usuario })
    return result.data || []
  },
  async createIncome(payload) {
    return apiRequest('createIncome', payload)
  },
  async listExpenses(usuario) {
    const result = await apiRequest('listExpenses', { usuario })
    return result.data || []
  },
  async createExpense(payload) {
    return apiRequest('createExpense', payload)
  },
  async listBudgets(usuario) {
    const result = await apiRequest('listBudgets', { usuario })
    return result.data || []
  },
  async createBudget(payload) {
    return apiRequest('createBudget', payload)
  },
  async listGoals(usuario) {
    const result = await apiRequest('listGoals', { usuario })
    return result.data || []
  },
  async createGoal(payload) {
    return apiRequest('createGoal', payload)
  },
  async listDebts(usuario) {
    const result = await apiRequest('listDebts', { usuario })
    return result.data || []
  },
  async createDebt(payload) {
    return apiRequest('createDebt', payload)
  },
}
