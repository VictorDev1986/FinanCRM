import { useEffect, useState } from 'react'
import FormField from '../components/FormField.jsx'
import SectionHeader from '../components/SectionHeader.jsx'
import { currencyOptions } from '../app/constants.js'
import { storage } from '../utils/storage.js'
import { notify } from '../utils/notify.js'

export default function Configuracion() {
  const [theme, setTheme] = useState(storage.get('theme') || 'dark')
  const [currency, setCurrency] = useState(storage.get('currency') || 'USD')
  const [aiModel, setAiModel] = useState(storage.get('aiModel') || 'gpt-4o')

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    storage.set('theme', theme)
  }, [theme])

  const handleSave = () => {
    storage.set('theme', theme)
    storage.set('currency', currency)
    storage.set('aiModel', aiModel)
    notify.success('Configuracion guardada')
  }

  return (
    <div className="space-y-6">
      <SectionHeader title="Configuracion" subtitle="Preferencias" />
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-slate-800/50 bg-slate-950/60 p-5 shadow-soft">
          <FormField label="Tema">
            <select className="input" value={theme} onChange={(event) => setTheme(event.target.value)}>
              <option value="dark">Oscuro</option>
              <option value="light">Claro</option>
            </select>
          </FormField>
          <FormField label="Moneda">
            <select
              className="input"
              value={currency}
              onChange={(event) => setCurrency(event.target.value)}
            >
              {currencyOptions.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </FormField>
        </div>
        <div className="rounded-xl border border-slate-800/50 bg-slate-950/60 p-5 shadow-soft">
          <FormField label="Modelo IA">
            <select
              className="input"
              value={aiModel}
              onChange={(event) => setAiModel(event.target.value)}
            >
              <option value="gpt-4o">GPT-4o</option>
              <option value="gpt-4.1">GPT-4.1</option>
            </select>
          </FormField>
          <button
            type="button"
            className="btn-primary mt-4"
            onClick={handleSave}
          >
            Guardar
          </button>
        </div>
      </div>
    </div>
  )
}
