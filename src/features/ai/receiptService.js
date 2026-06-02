import { apiRequest } from '../../api/client.js'

export const receiptService = {
  async uploadReceipt(payload) {
    return apiRequest('uploadReceipt', payload)
  },
  async analyzeReceipt(payload) {
    return apiRequest('analyzeReceipt', payload)
  },
  async saveExpense(payload) {
    return apiRequest('saveExpense', payload)
  },
}
