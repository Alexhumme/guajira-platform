export function formatDate(value?: string | null) {
  if (!value) return '—'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return new Intl.DateTimeFormat('es-CO', { day: '2-digit', month: 'short', year: 'numeric' }).format(date)
}

export function formatCurrency(value: unknown) {
  const amount = Number(value || 0)
  return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(amount)
}

export function formatValue(value: unknown) {
  if (value === null || value === undefined || value === '') return '—'
  if (typeof value === 'boolean') return value ? 'Sí' : 'No'
  if (typeof value === 'number') {
    return new Intl.NumberFormat('es-CO', { maximumFractionDigits: 0 }).format(value)
  }
  return String(value)
}
