import type { FormField } from '../../types'
import type { SelectOption } from './types'

export function normalizeFieldValue(field: FormField, value: unknown) {
  if (field.type === 'checkbox') return Boolean(value)
  if (field.type === 'number') {
    if (value === '' || value === null || value === undefined) return ''
    return Number(value)
  }
  if (field.type === 'date') {
    if (value === '' || value === null || value === undefined) return ''
    if (typeof value === 'string') {
      return value.includes('T') ? value.slice(0, 10) : value
    }
    if (value instanceof Date) {
      return value.toISOString().slice(0, 10)
    }
    return String(value)
  }
  return value ?? ''
}

export function guessOptionValue(item: Record<string, unknown>) {
  const keys = Object.keys(item)
  const normalized = keys.find((key) => key === 'id' || key.endsWith('_id') || key.startsWith('id_'))
  if (normalized && item[normalized] !== undefined) return String(item[normalized])
  const fallback = keys[0]
  return String(item[fallback])
}

export function guessOptionLabel(item: Record<string, unknown>) {
  if (typeof item.nombres === 'string' && typeof item.comunidad === 'string') {
    return `${item.nombres} - ${item.comunidad}`
  }
  if (typeof item.nombres === 'string') return item.nombres
  if (typeof item.nombre === 'string' && typeof item.comunidad === 'string') {
    return `${item.nombre} - ${item.comunidad}`
  }
  if (typeof item.nombre === 'string') return item.nombre
  if (typeof item.username === 'string') return item.username
  if (typeof item.title === 'string') return item.title
  if (typeof item.comunidad === 'string') return item.comunidad
  if (typeof item.municipio === 'string') return item.municipio
  if (typeof item.rol === 'string') return item.rol
  if (typeof item.tipo === 'string') return item.tipo
  const candidate = Object.values(item).find((value) => typeof value === 'string')
  return candidate ? String(candidate) : guessOptionValue(item)
}

export function createOptionsFromRecords(records: Record<string, unknown>[]) {
  return records.map((record) => ({
    value: guessOptionValue(record),
    label: guessOptionLabel(record),
  }))
}

export function interpolatePath(template: string, values: Record<string, unknown>) {
  return template.replace(/\{([^}]+)\}/g, (_, key) => {
    const raw = values[key]
    if (raw !== undefined && raw !== null) return String(raw)
    const fallback = Object.keys(values).find((candidate) => candidate.toLowerCase() === key.toLowerCase())
    if (fallback) return String(values[fallback] ?? '')
    return ''
  })
}

export function fileToDataURL(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result)
      } else {
        reject(new Error('No se pudo leer el archivo.'))
      }
    }
    reader.onerror = () => reject(new Error('No se pudo leer el archivo.'))
    reader.readAsDataURL(file)
  })
}
