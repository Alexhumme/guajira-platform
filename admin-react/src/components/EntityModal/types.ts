import type { FormField } from '../../types'

export type SelectOption = { value: string; label: string }

export type NestedItem = Record<string, unknown> & {
  id?: string
  isNew?: boolean
  isExisting?: boolean
  fileData?: string
  fileName?: string
}

export type NestedChanges = Record<string, { items: NestedItem[]; removedIds: string[] }>

export type EntityModalProps = {
  isOpen: boolean
  title: string
  fields: FormField[]
  initialValues: Record<string, unknown>
  onClose: () => void
  onSubmit: (payload: Record<string, unknown>, nestedChanges: NestedChanges) => void
  isSubmitting?: boolean
}
