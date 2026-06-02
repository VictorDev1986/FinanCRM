export default function DataTable({ columns, rows }) {
  return (
    <div className="overflow-x-auto rounded-xl border border-slate-800/40 bg-slate-950/60 shadow-soft">
      <table className="min-w-full text-left text-sm">
        <thead className="bg-slate-900/50 text-xs uppercase tracking-[0.2em] text-slate-400">
          <tr>
            {columns.map((column) => (
              <th key={column} className="px-4 py-3 font-medium">
                {column}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-800/60 text-slate-200">
          {rows.map((row) => (
            <tr key={row.id}>
              {row.cells.map((cell, index) => (
                <td key={index} className="px-4 py-3">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
