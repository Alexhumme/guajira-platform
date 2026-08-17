import { useEffect, useMemo, useRef, useState, type FormEvent } from 'react'
import { readJson, resolveApiPath } from '../../lib/api'
import type { FormField } from '../../types'
import type { EntityModalProps, NestedChanges, NestedItem, SelectOption } from './types'
import { normalizeFieldValue, createOptionsFromRecords, interpolatePath, fileToDataURL, guessOptionLabel, guessOptionValue } from './helpers'
import { FieldInput } from './FieldInput'
import { MediaField } from './MediaField'
import { SubcrudField } from './SubcrudField'

export function EntityModal({ isOpen, title, fields, initialValues, onClose, onSubmit, isSubmitting = false }: EntityModalProps) {
  const [values, setValues] = useState<Record<string, unknown>>({})
  const [optionsByField, setOptionsByField] = useState<Record<string, SelectOption[]>>({})
  const [nestedOptionsByField, setNestedOptionsByField] = useState<Record<string, Record<string, SelectOption[]>>>({})
  const [nestedItemsByField, setNestedItemsByField] = useState<Record<string, NestedItem[]>>({})
  const [nestedRemovedByField, setNestedRemovedByField] = useState<Record<string, string[]>>({})
  const [existingOptionsByField, setExistingOptionsByField] = useState<Record<string, SelectOption[]>>({})
  const [mediaUrlByField, setMediaUrlByField] = useState<Record<string, string>>({})
  const [selectedExistingByField, setSelectedExistingByField] = useState<Record<string, string>>({})
  const [mediaModeByField, setMediaModeByField] = useState<Record<string, 'file' | 'url' | 'existing'>>({})
  const [directMediaDataByField, setDirectMediaDataByField] = useState<Record<string, { fileData?: string; fileName?: string }>>({})
  const [nestedDraftByField, setNestedDraftByField] = useState<Record<string, Record<string, unknown>>>({})
  const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({})

  useEffect(() => {
    if (!isOpen) return

    const nextValues = fields.reduce<Record<string, unknown>>((accumulator, field) => {
      const fallback = field.defaultValue ?? ''
      accumulator[field.key] = normalizeFieldValue(field, initialValues[field.key] ?? fallback)
      return accumulator
    }, {})

    setValues(nextValues)
    setOptionsByField({})
    setNestedOptionsByField({})
    setNestedItemsByField({})
    setNestedRemovedByField({})
    setExistingOptionsByField({})
    setMediaUrlByField({})
    setSelectedExistingByField({})
    setDirectMediaDataByField({})
    setNestedDraftByField({})
    setMediaModeByField(fields.reduce<Record<string, 'file' | 'url' | 'existing'>>((accumulator, field) => {
      if (field.type === 'media') accumulator[field.key] = 'file'
      return accumulator
    }, {}))
  }, [fields, initialValues, isOpen])

  useEffect(() => {
    if (!isOpen) return

    async function loadOptionsAndNestedItems() {
      const selectFields = fields.filter((field) => field.type === 'select' && field.optionSource)
      const nestedSelectFields = fields.flatMap((field) => (field.type === 'subcrud' ? (field.nestedFields ?? [])
        .filter((nestedField) => nestedField.type === 'select' && nestedField.optionSource)
        .map((nestedField) => ({ parentKey: field.key, field: nestedField })) : []))
      const nestedFields = fields.filter((field) => (field.type === 'media' || field.type === 'subcrud') && field.nestedEndpoint && field.nestedCollectionKey)

      const selectPromises = selectFields.map(async (field) => {
        try {
          const data = await readJson<Record<string, unknown>[]>(field.optionSource!)
          return { key: field.key, options: createOptionsFromRecords(data) }
        } catch (error) {
          console.error('No se pudieron cargar opciones para', field.key, field.optionSource, error)
          return { key: field.key, options: field.options ?? [] }
        }
      })

      const existingOptions: Record<string, SelectOption[]> = {}
      const nestedSelectPromises = nestedSelectFields.map(async ({ parentKey, field }) => {
        try {
          const data = await readJson<Record<string, unknown>[]>(field.optionSource!)
          return { parentKey, key: field.key, options: createOptionsFromRecords(data) }
        } catch (error) {
          console.error('No se pudieron cargar opciones para', field.key, field.optionSource, error)
          return { parentKey, key: field.key, options: field.options ?? [] }
        }
      })
      const nestedPromises = nestedFields.map(async (field) => {
        const items: NestedItem[] = []
        const removedIds: string[] = []

        if (field.existingSource && field.allowExisting) {
          try {
            const resolvedSource = interpolatePath(field.existingSource, initialValues)
            const data = await readJson<Array<string | Record<string, unknown>>>(resolvedSource)
            existingOptions[field.key] = Array.isArray(data)
              ? data.map((value) => {
                if (typeof value === 'string') return { value, label: value }
                if (typeof value.media_dir === 'string') return { value: value.media_dir, label: value.media_dir }
                return { value: guessOptionValue(value), label: guessOptionLabel(value) }
              })
              : []
          } catch (error) {
            console.error('No se pudieron cargar opciones existentes para', field.key, field.existingSource, error)
            existingOptions[field.key] = []
          }
        }

        const entityId = initialValues.id_comunidad ?? initialValues.id ?? Object.entries(initialValues).find(([key]) => key.startsWith('id_'))?.[1]
        if (entityId && field.nestedEndpoint && field.nestedCollectionKey) {
          try {
            const path = `${field.nestedEndpoint}/${entityId}/${field.nestedCollectionKey}`
            const data = await readJson<Record<string, unknown>[]>(path)
            if (Array.isArray(data)) {
              items.push(...data.map((item) => ({
                ...item,
                id: String(item[field.nestedListKey ?? 'id'] ?? item.id ?? ''),
                isExisting: true,
              })))
            }
          } catch (error) {
            console.error('No se pudieron cargar elementos anidados para', field.key, error)
          }
        }

        return { key: field.key, items, removedIds }
      })

      const loadedSelects = await Promise.all(selectPromises)
      setOptionsByField(loadedSelects.reduce<Record<string, SelectOption[]>>((accumulator, item) => {
        accumulator[item.key] = item.options
        return accumulator
      }, {}))

      const loadedNestedSelects = await Promise.all(nestedSelectPromises)
      setNestedOptionsByField(loadedNestedSelects.reduce<Record<string, Record<string, SelectOption[]>>>((accumulator, item) => {
        accumulator[item.parentKey] = {
          ...accumulator[item.parentKey],
          [item.key]: item.options,
        }
        return accumulator
      }, {}))

      const loadedNested = await Promise.all(nestedPromises)
      setNestedItemsByField((current) => loadedNested.reduce<Record<string, NestedItem[]>>((accumulator, item) => {
        accumulator[item.key] = item.items
        return accumulator
      }, { ...current }))
      setNestedRemovedByField((current) => loadedNested.reduce<Record<string, string[]>>((accumulator, item) => {
        accumulator[item.key] = item.removedIds
        return accumulator
      }, { ...current }))
      setExistingOptionsByField(existingOptions)
    }

    void loadOptionsAndNestedItems()
  }, [fields, initialValues, isOpen])

  const isDisabled = useMemo(() => isSubmitting, [isSubmitting])

  if (!isOpen) return null

  function handleChange(key: string, value: unknown) {
    setValues((current) => ({ ...current, [key]: value }))
  }

  function handleNestedDraftChange(fieldKey: string, draftKey: string, value: unknown) {
    setNestedDraftByField((current) => ({
      ...current,
      [fieldKey]: {
        ...current[fieldKey],
        [draftKey]: value,
      },
    }))
  }

  function handleRemoveNestedItem(fieldKey: string, item: NestedItem) {
    setNestedItemsByField((current) => ({
      ...current,
      [fieldKey]: (current[fieldKey] ?? []).filter((currentItem) => currentItem.id !== item.id),
    }))

    if (item.isExisting && item.id) {
      setNestedRemovedByField((current) => ({
        ...current,
        [fieldKey]: [...(current[fieldKey] ?? []), String(item.id)],
      }))
    }
  }

  async function handleAddMedia(field: FormField) {
    const currentMode = mediaModeByField[field.key] ?? 'file'
    const existingValue = selectedExistingByField[field.key]
    const urlValue = mediaUrlByField[field.key]
    const fileInput = fileInputRefs.current[field.key]
    const file = fileInput?.files?.[0]

    let mediaDir: string | undefined
    let fileData: string | undefined
    let fileName: string | undefined

    if (currentMode === 'file' && file) {
      if (field.key === 'avatar_dir' && !file.type.startsWith('image/')) return
      fileData = await fileToDataURL(file)
      fileName = file.name
      mediaDir = file.name
    }

    if (currentMode === 'url' && urlValue) {
      mediaDir = urlValue.trim()
    }

    if (currentMode === 'existing' && existingValue) {
      mediaDir = existingValue
    }

    if (!mediaDir) return

    const newItem: NestedItem = {
      id: `new-${Date.now()}`,
      media_dir: mediaDir,
      fileData,
      fileName,
      isNew: true,
      isExisting: currentMode === 'existing',
    }

    if (field.nestedEndpoint && field.nestedCollectionKey) {
      setNestedItemsByField((current) => ({
        ...current,
        [field.key]: [...(current[field.key] ?? []), newItem],
      }))
    } else {
      setValues((current) => ({
        ...current,
        [field.key]: currentMode === 'file' ? fileData ?? newItem.media_dir : newItem.media_dir,
      }))
      setDirectMediaDataByField((current) => ({
        ...current,
        [field.key]: {
          fileData,
          fileName,
        },
      }))
    }
    setMediaUrlByField((current) => ({ ...current, [field.key]: '' }))
    setSelectedExistingByField((current) => ({ ...current, [field.key]: '' }))
    if (fileInput) fileInput.value = ''
  }

  function handleAddSubcrudItem(field: FormField) {
    const draft = nestedDraftByField[field.key] ?? {}
    const missingRequired = field.nestedFields?.find((nestedField) => nestedField.required && !draft[nestedField.key])
    if (missingRequired) return

    const newItem: NestedItem = {
      id: `new-${Date.now()}`,
      ...draft,
      isNew: true,
    }

    setNestedItemsByField((current) => ({
      ...current,
      [field.key]: [...(current[field.key] ?? []), newItem],
    }))
    setNestedDraftByField((current) => ({ ...current, [field.key]: {} }))
  }

  async function uploadDirectField(field: FormField): Promise<string | undefined> {
    const fileInput = fileInputRefs.current[field.key]
    const file = fileInput?.files?.[0]
    const directData = directMediaDataByField[field.key]
    if (field.uploadEndpoint && directData?.fileData && directData.fileName) {
      const response = await fetch(resolveApiPath(field.uploadEndpoint), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fileData: directData.fileData, fileName: directData.fileName }),
      })
      if (!response.ok) throw new Error('No se pudo subir el archivo')
      const data = await response.json()
      return String(data.path ?? data.avatar_dir ?? data.media_dir ?? '')
    }
    if (file && field.uploadEndpoint) {
      const fileData = await fileToDataURL(file)
      const response = await fetch(resolveApiPath(field.uploadEndpoint), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fileData, fileName: file.name }),
      })
      if (!response.ok) throw new Error('No se pudo subir el archivo')
      const data = await response.json()
      return String(data.path ?? data.avatar_dir ?? data.media_dir ?? '')
    }
    return undefined
  }

  async function buildPayload() {
    const payload = { ...values }
    for (const field of fields) {
      if (field.type !== 'media' || field.nestedEndpoint) continue
      const mode = mediaModeByField[field.key] ?? 'file'
      if (mode === 'file' && field.uploadEndpoint) {
        const uploaded = await uploadDirectField(field)
        if (uploaded) payload[field.key] = uploaded
      }
      if (mode === 'url') {
        payload[field.key] = mediaUrlByField[field.key] ?? values[field.key] ?? ''
      }
      if (mode === 'existing') {
        payload[field.key] = selectedExistingByField[field.key] ?? values[field.key] ?? ''
      }
    }
    return Object.entries(payload).reduce<Record<string, unknown>>((accumulator, [key, value]) => {
      accumulator[key] = value === '' ? null : value
      return accumulator
    }, {})
  }

  function buildNestedChanges() {
    return fields.reduce<NestedChanges>((accumulator, field) => {
      if (field.type !== 'media' && field.type !== 'subcrud') return accumulator
      accumulator[field.key] = {
        items: nestedItemsByField[field.key] ?? [],
        removedIds: nestedRemovedByField[field.key] ?? [],
      }
      return accumulator
    }, {})
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const payload = await buildPayload()
    onSubmit(payload, buildNestedChanges())
  }

  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true">
      <div className="modal-card">
        <div className="modal-header">
          <h3>{title}</h3>
          <button type="button" className="modal-close" onClick={onClose}>Cerrar</button>
        </div>
        <form onSubmit={handleSubmit} className="modal-form">
          {fields.map((field) => {
            const value = values[field.key]
            const options = optionsByField[field.key] ?? field.options ?? []

            if (field.type === 'media') {
              return (
                <MediaField
                  key={field.key}
                  field={field}
                  value={value}
                  options={existingOptionsByField[field.key] ?? []}
                  mode={mediaModeByField[field.key] ?? 'file'}
                  mediaUrl={mediaUrlByField[field.key] ?? ''}
                  selectedExisting={selectedExistingByField[field.key] ?? ''}
                  nestedItems={nestedItemsByField[field.key] ?? []}
                  directMediaData={directMediaDataByField[field.key]}
                  fileInputRef={(element) => { fileInputRefs.current[field.key] = element }}
                  onModeChange={(nextMode) => setMediaModeByField((current) => ({ ...current, [field.key]: nextMode }))}
                  onMediaUrlChange={(nextUrl) => setMediaUrlByField((current) => ({ ...current, [field.key]: nextUrl }))}
                  onSelectedExistingChange={(nextValue) => setSelectedExistingByField((current) => ({ ...current, [field.key]: nextValue }))}
                  onAddMedia={() => void handleAddMedia(field)}
                  onRemoveNestedItem={(item) => handleRemoveNestedItem(field.key, item)}
                />
              )
            }

            if (field.type === 'subcrud') {
              return (
                <SubcrudField
                  key={field.key}
                  field={field}
                  items={nestedItemsByField[field.key] ?? []}
                  draft={nestedDraftByField[field.key] ?? {}}
                  optionsByField={nestedOptionsByField[field.key] ?? {}}
                  onDraftChange={(draftKey, draftValue) => handleNestedDraftChange(field.key, draftKey, draftValue)}
                  onAdd={() => handleAddSubcrudItem(field)}
                  onRemove={(item) => handleRemoveNestedItem(field.key, item)}
                />
              )
            }

            return (
              <FieldInput
                key={field.key}
                field={field}
                value={value}
                options={options}
                onChange={(nextValue) => handleChange(field.key, nextValue)}
              />
            )
          })}
          <div className="modal-actions">
            <button type="button" className="secondary-action" onClick={onClose}>Cancelar</button>
            <button type="submit" disabled={isDisabled}>{isSubmitting ? 'Guardando...' : 'Guardar'}</button>
          </div>
        </form>
      </div>
    </div>
  )
}
