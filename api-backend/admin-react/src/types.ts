import type { LucideIcon } from 'lucide-react'

export type FieldType = 'text' | 'number' | 'textarea' | 'checkbox' | 'date' | 'select' | 'password'

export type FormField = {
  key: string
  label: string
  type?: FieldType
  required?: boolean
  defaultValue?: string | number | boolean | null
  placeholder?: string
  options?: Array<{ value: string; label: string }>
}

export type ColumnDefinition = {
  key: string
  label: string
  render?: (row: Record<string, unknown>) => string
}

export type SectionDefinition = {
  key: SectionKey
  label: string
  endpoint: string
  description: string
  icon: LucideIcon
  entityIdKey: string
  canMutate?: boolean
  columns: ColumnDefinition[]
  formFields: FormField[]
  emptyMessage?: string
}

export type SectionKey = 'monitoring' | 'roles' | 'tipos' | 'departamentos' | 'municipios' | 'comunidades' | 'miembros' | 'admins' | 'productos' | 'rutas' | 'categorias' | 'posts'
