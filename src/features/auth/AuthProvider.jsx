import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { authService } from './authService.js'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    authService.getSession().then((session) => {
      setSession(session)
      setLoading(false)
    })

    const { data: listener } = authService.onAuthChange((session) => {
      setSession(session)
    })

    return () => listener?.subscription?.unsubscribe()
  }, [])

  const login = async (credentials) => {
    const data = await authService.login(credentials)
    setSession(data.session)
  }

  const register = async ({ nombre, email, password }) => {
    const data = await authService.register({ nombre, email, password })
    if (data.session) {
      setSession(data.session)
    }
    return data
  }

  const logout = async () => {
    await authService.logout()
    setSession(null)
  }

  const value = useMemo(
    () => ({ session, loading, login, register, logout }),
    [session, loading]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
