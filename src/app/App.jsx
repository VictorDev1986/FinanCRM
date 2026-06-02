import { Suspense, lazy } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import AppShell from '../components/AppShell.jsx'
import Loading from '../components/Loading.jsx'
import ProtectedRoute from '../features/auth/ProtectedRoute.jsx'
import { appRoutes } from './routes.jsx'

const Login = lazy(() => import('../pages/Login.jsx'))
const Register = lazy(() => import('../pages/Register.jsx'))

export default function App() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          <Loading label="Cargando panel" />
        </div>
      }
    >
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route element={<ProtectedRoute />}>
          <Route element={<AppShell />}>
            {appRoutes.map((route) => {
              const Component = route.component
              return <Route key={route.path} path={route.path} element={<Component />} />
            })}
          </Route>
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  )
}
