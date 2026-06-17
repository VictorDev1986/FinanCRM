export function formatCurrency(value, currency) {
  if (value === null || value === undefined) return '--'
  const cur = currency || localStorage.getItem('currency') || 'USD'
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: cur,
    maximumFractionDigits: 2,
  }).format(Number(value))
}

export function formatPercent(value) {
  if (value === null || value === undefined) return '--'
  const sign = value >= 0 ? '+' : ''
  return `${sign}${value.toFixed(1)}%`
}
