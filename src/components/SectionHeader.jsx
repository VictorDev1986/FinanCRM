export default function SectionHeader({ title, subtitle, actions }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-slate-400">{subtitle}</p>
        <h3 className="text-xl font-semibold text-slate-100">{title}</h3>
      </div>
      {actions}
    </div>
  )
}
