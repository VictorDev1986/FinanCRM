import { formatCurrency, formatPercent } from '../utils/format.js'

export default function StatCard({ label, value, trend }) {
  return (
    <div className="rounded-xl border border-slate-800/50 bg-slate-950/60 p-5 shadow-soft">
      <p className="text-xs uppercase tracking-[0.3em] text-slate-400">{label}</p>
      <div className="mt-4 flex items-end justify-between">
        <h3 className="text-2xl font-semibold text-slate-100">
          {formatCurrency(value)}
        </h3>
        <span
          className={`text-sm font-semibold ${trend >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}
        >
          {formatPercent(trend)}
        </span>
      </div>
    </div>
  )
}
