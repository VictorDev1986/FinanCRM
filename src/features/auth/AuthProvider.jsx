import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { authService } from './authService.js'
import { storage } from '../../utils/storage.js'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const saved = storage.get('session')
    if (saved) {
      setSession(saved)
    }
    setLoading(false)
  }, [])

  const login = async (credentials) => {
    const result = await authService.login(credentials)
    storage.set('session', result.user)
    setSession(result.user)
  }

  const logout = () => {
    storage.remove('session')
    setSession(null)
  }

  const value = useMemo(
    () => ({ session, loading, login, logout }),
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
