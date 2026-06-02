export default function FormField({ label, children }) {
  return (
    <label className="grid gap-2 text-sm text-slate-300">
      <span className="text-xs uppercase tracking-[0.2em] text-slate-400">{label}</span>
      {children}
    </label>
  )
}
