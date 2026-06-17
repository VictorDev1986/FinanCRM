const MONTH_LABELS = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic']

function parseDateValue(value) {
  if (!value) return null
  if (value instanceof Date && !Number.isNaN(value.getTime())) return value

  const asString = String(value).trim()
  if (!asString) return null

  const direct = new Date(asString)
  if (!Number.isNaN(direct.getTime())) return direct

  const dmyMatch = asString.match(/^(\d{1,2})[/-](\d{1,2})[/-](\d{4})$/)
  if (dmyMatch) {
    const day = Number(dmyMatch[1])
    const month = Number(dmyMatch[2])
    const year = Number(dmyMatch[3])
    const parsed = new Date(year, month - 1, day)
    if (!Number.isNaN(parsed.getTime())) return parsed
  }

  const ymdMatch = asString.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/)
  if (ymdMatch) {
    const year = Number(ymdMatch[1])
    const month = Number(ymdMatch[2])
    const day = Number(ymdMatch[3])
    const parsed = new Date(year, month - 1, day)
    if (!Number.isNaN(parsed.getTime())) return parsed
  }

  return null
}

export function parseAmount(value) {
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : 0
}

export function monthKeyFromDate(value) {
  const date = parseDateValue(value)
  if (!date) return ''
  const month = String(date.getMonth() + 1).padStart(2, '0')
  return `${date.getFullYear()}-${month}`
}

export function getRecentMonthKeys(count, now = new Date()) {
  const keys = []
  for (let i = count - 1; i >= 0; i -= 1) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1)
    const month = String(date.getMonth() + 1).padStart(2, '0')
    keys.push(`${date.getFullYear()}-${month}`)
  }
  return keys
}

export function buildMonthlyTotals(rows, count, dateSelector, amountSelector) {
  const keys = getRecentMonthKeys(count)
  const totals = Object.fromEntries(keys.map((key) => [key, 0]))

  rows.forEach((row) => {
    const key = monthKeyFromDate(dateSelector(row))
    if (!key || totals[key] === undefined) return
    totals[key] += parseAmount(amountSelector(row))
  })

  return {
    keys,
    labels: keys.map((key) => {
      const monthIndex = Number(key.split('-')[1]) - 1
      return MONTH_LABELS[monthIndex] || key
    }),
    data: keys.map((key) => totals[key]),
    totals,
  }
}

export function sumByCategory(rows, dateSelector, categorySelector, amountSelector, monthKey) {
  const totals = {}
  rows.forEach((row) => {
    if (monthKey) {
      const rowKey = monthKeyFromDate(dateSelector(row))
      if (rowKey !== monthKey) return
    }
    const category = categorySelector(row) || 'Otros'
    totals[category] = (totals[category] || 0) + parseAmount(amountSelector(row))
  })

  const labels = Object.keys(totals)
  return {
    labels,
    data: labels.map((label) => totals[label]),
    totals,
  }
}

export function sumRows(rows, amountSelector) {
  return rows.reduce((acc, row) => acc + parseAmount(amountSelector(row)), 0)
}

export function calcTrend(prev, current) {
  if (!prev) return current ? 100 : 0
  return ((current - prev) / Math.abs(prev)) * 100
}
