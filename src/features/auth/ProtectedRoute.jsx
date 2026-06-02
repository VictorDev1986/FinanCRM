import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from './AuthProvider.jsx'
import Loading from '../../components/Loading.jsx'

export default function ProtectedRoute() {
  const { session, loading } = useAuth()

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loading label="Validando sesion" />
      </div>
    )
  }

  if (!session) {
    return <Navigate to="/login" replace />
  }

  return <Outlet />
}
