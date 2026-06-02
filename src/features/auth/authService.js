import { apiRequest } from '../../api/client.js'

export const authService = {
  async login({ email, password }) {
    return apiRequest('login', { email, password })
  },
  async register({ nombre, email, password }) {
    return apiRequest('register', { nombre, email, password })
  },
}
