import { supabase } from '../../lib/supabase.js'

export const authService = {
  async login({ email, password }) {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw error
    return data
  },

  async register({ nombre, email, password }) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { nombre } },
    })
    if (error) throw error
    return data
  },

  async logout() {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  },

  async getSession() {
    const { data } = await supabase.auth.getSession()
    return data.session
  },

  onAuthChange(callback) {
    return supabase.auth.onAuthStateChange((_event, session) => {
      callback(session)
    })
  },
}
