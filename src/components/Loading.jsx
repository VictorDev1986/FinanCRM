export default function Loading({ label = 'Cargando' }) {
  return (
    <div className="flex items-center gap-3 text-sm text-slate-400">
      <span className="relative flex h-3 w-3">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
        <span className="relative inline-flex h-3 w-3 rounded-full bg-emerald-500"></span>
      </span>
      {label}
    </div>
  )
}
