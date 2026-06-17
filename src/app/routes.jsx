import { lazy } from 'react'

const Dashboard = lazy(() => import('../pages/Dashboard.jsx'))
const Ingresos = lazy(() => import('../pages/Ingresos.jsx'))
const Gastos = lazy(() => import('../pages/Gastos.jsx'))
const Presupuestos = lazy(() => import('../pages/Presupuestos.jsx'))
const Metas = lazy(() => import('../pages/Metas.jsx'))
const Deudas = lazy(() => import('../pages/Deudas.jsx'))
const Reportes = lazy(() => import('../pages/Reportes.jsx'))
const Configuracion = lazy(() => import('../pages/Configuracion.jsx'))
const IaFacturas = lazy(() => import('../pages/IaFacturas.jsx'))

export const navItems = [
  { path: '/', label: 'Dashboard', icon: '📊' },
  { path: '/ingresos', label: 'Ingresos', icon: '💰' },
  { path: '/gastos', label: 'Gastos', icon: '💸' },
  { path: '/presupuestos', label: 'Presupuestos', icon: '📋' },
  { path: '/metas', label: 'Metas', icon: '🎯' },
  { path: '/deudas', label: 'Deudas', icon: '📉' },
  { path: '/reportes', label: 'Reportes', icon: '📄' },
  { path: '/ia-facturas', label: 'IA Facturas', icon: '🤖' },
  { path: '/configuracion', label: 'Configuracion', icon: '⚙️' },
]

export const appRoutes = [
  { path: '/', component: Dashboard },
  { path: '/ingresos', component: Ingresos },
  { path: '/gastos', component: Gastos },
  { path: '/presupuestos', component: Presupuestos },
  { path: '/metas', component: Metas },
  { path: '/deudas', component: Deudas },
  { path: '/reportes', component: Reportes },
  { path: '/ia-facturas', component: IaFacturas },
  { path: '/configuracion', component: Configuracion },
]
