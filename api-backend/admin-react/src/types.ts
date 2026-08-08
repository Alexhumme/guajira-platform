import type { LucideIcon } from 'lucide-react'

export type FieldType = 'text' | 'number' | 'textarea' | 'checkbox' | 'date' | 'select' | 'password' | 'media' | 'subcrud'

export type FormField = {
  key: string
  label: string
  type?: FieldType
  required?: boolean
  defaultValue?: string | number | boolean | null
  placeholder?: string
  options?: Array<{ value: string; label: string }>
  optionSource?: string
  nestedEndpoint?: string
  nestedCollectionKey?: string
  nestedListKey?: string
  nestedFields?: FormField[]
  allowUpload?: boolean
  allowUrl?: boolean
  allowExisting?: boolean
  existingSource?: string
  uploadEndpoint?: string
}

import type { ReactNode } from 'react'

export type ColumnDefinition = {
  key: string
  label: string
  render?: (row: Record<string, unknown>) => ReactNode
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
