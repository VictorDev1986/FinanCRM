import { useEffect, useRef } from 'react'
import { Chart, registerables } from 'chart.js'

Chart.register(...registerables)

export default function ChartCard({ title, subtitle, type = 'line', data, options }) {
  const canvasRef = useRef(null)

  useEffect(() => {
    if (!canvasRef.current) return
    const chart = new Chart(canvasRef.current, {
      type,
      data,
      options,
    })
    return () => chart.destroy()
  }, [type, data, options])

  return (
    <div className="rounded-xl border border-slate-800/50 bg-slate-950/60 p-5 shadow-soft">
      <div className="mb-4">
        <p className="text-xs uppercase tracking-[0.3em] text-slate-400">{subtitle}</p>
        <h4 className="text-base font-semibold text-slate-100">{title}</h4>
      </div>
      <canvas ref={canvasRef} height="140" />
    </div>
  )
}
