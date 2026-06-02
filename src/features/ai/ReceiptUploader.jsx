import { useMemo, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { receiptService } from './receiptService.js'
import { notify } from '../../utils/notify.js'
import Loading from '../../components/Loading.jsx'
import { expenseCategories } from '../../app/constants.js'

export default function ReceiptUploader({ onConfirm, usuario }) {
  const inputRef = useRef(null)
  const [file, setFile] = useState(null)
  const [preview, setPreview] = useState('')
  const [status, setStatus] = useState('idle')
  const [result, setResult] = useState(null)

  const fileLabel = useMemo(() => {
    if (!file) return 'Arrastra una factura o haz clic'
    return `${file.name} (${Math.round(file.size / 1024)} KB)`
  }, [file])

  const handleFile = (selected) => {
    if (!selected) return
    const accepted = ['image/png', 'image/jpeg', 'image/webp', 'application/pdf']
    if (!accepted.includes(selected.type)) {
      notify.error('Formato no soportado')
      return
    }

    setFile(selected)
    setResult(null)

    if (selected.type.startsWith('image/')) {
      const reader = new FileReader()
      reader.onload = () => setPreview(reader.result)
      reader.readAsDataURL(selected)
    } else {
      setPreview('')
    }
  }

  const handleDrop = (event) => {
    event.preventDefault()
    const dropped = event.dataTransfer.files[0]
    handleFile(dropped)
  }

  const handleAnalyze = async () => {
    if (!file) return
    setStatus('analyzing')

    const reader = new FileReader()
    reader.onload = async () => {
      try {
        const base64 = String(reader.result || '').split(',')[1] || ''
        const payload = {
          imageBase64: base64,
          imageMime: file.type,
          fileName: file.name,
        }

        const upload = await receiptService.uploadReceipt(payload)
        const response = await receiptService.analyzeReceipt(payload)
        setResult({
          ...response.data,
          receiptFileId: upload.data?.fileId,
          receiptFileUrl: upload.data?.fileUrl,
          categoria: response.data.categoria || expenseCategories.at(-1),
        })
        notify.success('Factura analizada')
      } catch (error) {
        notify.error(error.message)
      } finally {
        setStatus('ready')
      }
    }
    reader.readAsDataURL(file)
  }

  const handleConfirm = async () => {
    if (!result) return
    setStatus('saving')
    try {
      await receiptService.saveExpense({
        expense: {
          ...result,
          usuario: usuario || result.usuario || '',
        },
      })
      notify.success('Gasto guardado')
      onConfirm?.(result)
      setFile(null)
      setPreview('')
      setResult(null)
    } catch (error) {
      notify.error(error.message)
    } finally {
      setStatus('ready')
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
      <motion.div
        className="rounded-xl border border-slate-800/30 bg-slate-950/40 p-6 shadow-soft"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div
          className="group flex min-h-[240px] flex-col items-center justify-center rounded-xl border border-dashed border-slate-700/60 bg-gradient-to-br from-slate-900/40 via-slate-900/10 to-emerald-500/10 p-6 text-center text-sm text-slate-300"
          onDrop={handleDrop}
          onDragOver={(event) => event.preventDefault()}
          onClick={() => inputRef.current?.click()}
          role="button"
          tabIndex={0}
        >
          <p className="text-base font-semibold text-slate-100">Subir factura</p>
          <p className="mt-2 max-w-xs text-slate-400">{fileLabel}</p>
          <p className="mt-4 text-xs uppercase tracking-[0.25em] text-emerald-400">
            JPG PNG WEBP PDF
          </p>
          <input
            ref={inputRef}
            type="file"
            accept="image/*,.pdf"
            className="hidden"
            onChange={(event) => handleFile(event.target.files?.[0])}
          />
        </div>
        <div className="mt-6 flex flex-wrap items-center gap-3">
          <button
            type="button"
            className="btn-primary"
            onClick={handleAnalyze}
            disabled={!file || status === 'analyzing' || status === 'saving'}
          >
            {status === 'analyzing' ? 'Analizando...' : 'Analizar con IA'}
          </button>
          <button
            type="button"
            className="btn-ghost"
            onClick={() => {
              setFile(null)
              setPreview('')
              setResult(null)
            }}
            disabled={!file}
          >
            Limpiar
          </button>
          {(status === 'analyzing' || status === 'saving') && (
            <Loading label="Procesando" />
          )}
        </div>
      </motion.div>

      <motion.div
        className="rounded-xl border border-slate-800/30 bg-slate-950/50 p-6 shadow-soft"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">
          Vista previa
        </p>
        <div className="mt-4 min-h-[180px] rounded-lg border border-slate-800/60 bg-slate-950/40 p-4 text-sm text-slate-300">
          {preview ? (
            <img src={preview} alt="Factura" className="max-h-48 w-auto" />
          ) : (
            <p className="text-slate-500">Sin vista previa disponible</p>
          )}
        </div>
        <div className="mt-5 rounded-lg border border-slate-800/50 bg-slate-950/60 p-4">
          <p className="text-sm font-semibold text-slate-200">Datos detectados</p>
          <div className="mt-3 grid gap-3 text-sm text-slate-300">
            <label className="grid gap-1">
              Negocio
              <input
                className="input"
                value={result?.negocio || ''}
                onChange={(event) =>
                  setResult((prev) => ({ ...prev, negocio: event.target.value }))
                }
                placeholder="Nombre del negocio"
              />
            </label>
            <label className="grid gap-1">
              Fecha
              <input
                className="input"
                value={result?.fecha || ''}
                onChange={(event) =>
                  setResult((prev) => ({ ...prev, fecha: event.target.value }))
                }
                placeholder="2026-05-20"
              />
            </label>
            <label className="grid gap-1">
              Total
              <input
                className="input"
                value={result?.total || ''}
                onChange={(event) =>
                  setResult((prev) => ({ ...prev, total: event.target.value }))
                }
                placeholder="0.00"
              />
            </label>
            <label className="grid gap-1">
              Categoria
              <select
                className="input"
                value={result?.categoria || ''}
                onChange={(event) =>
                  setResult((prev) => ({ ...prev, categoria: event.target.value }))
                }
              >
                <option value="">Selecciona</option>
                {expenseCategories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <button
            type="button"
            className="btn-primary mt-4 w-full"
            onClick={handleConfirm}
            disabled={!result || status === 'saving'}
          >
            Confirmar y guardar
          </button>
        </div>
      </motion.div>
    </div>
  )
}
