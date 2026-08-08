// Utilidades compartidas para invocar las rutas CRUD del backend admin.
const apiBase = import.meta.env.VITE_API_BASE ?? (import.meta.env.DEV ? 'http://localhost:5000' : '')

export function resolveApiPath(path: string) {
  if (path.startsWith('http://') || path.startsWith('https://')) return path
  if (!apiBase) return `${path.startsWith('/') ? '' : '/'}${path}`
  return `${apiBase.replace(/\/$/, '')}${path.startsWith('/') ? '' : '/'}${path}`
}

export async function readJson<T>(path: string): Promise<T> {
  const response = await fetch(resolveApiPath(path), { credentials: 'include' })
  if (!response.ok) throw new Error(`No se pudo cargar ${path}`)
  return response.json() as Promise<T>
}

export async function createRecord<T>(path: string, payload: Record<string, unknown>): Promise<T> {
  const response = await fetch(resolveApiPath(path), {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    const errorPayload = await response.json().catch(() => ({}))
    throw new Error(errorPayload.message || 'No se pudo crear el registro')
  }

  return response.json() as Promise<T>
}

export async function updateRecord<T>(path: string, payload: Record<string, unknown>): Promise<T> {
  const response = await fetch(resolveApiPath(path), {
    method: 'PUT',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    const errorPayload = await response.json().catch(() => ({}))
    throw new Error(errorPayload.message || 'No se pudo actualizar el registro')
  }

  return response.json() as Promise<T>
}

export async function deleteRecord(path: string): Promise<void> {
  const response = await fetch(resolveApiPath(path), {
    method: 'DELETE',
    credentials: 'include',
  })

  if (!response.ok) {
    const errorPayload = await response.json().catch(() => ({}))
    throw new Error(errorPayload.message || 'No se pudo eliminar el registro')
  }
}

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
