import { useEffect, useMemo, useRef, useState, type FormEvent } from 'react'
import { readJson } from '../lib/api'
import type { FormField } from '../types'

type SelectOption = { value: string; label: string }

type NestedItem = Record<string, unknown> & {
  id?: string
  isNew?: boolean
  isExisting?: boolean
  fileData?: string
  fileName?: string
}

type NestedChanges = Record<string, { items: NestedItem[]; removedIds: string[] }>

type EntityModalProps = {
  isOpen: boolean
  title: string
  fields: FormField[]
  initialValues: Record<string, unknown>
  onClose: () => void
  onSubmit: (payload: Record<string, unknown>, nestedChanges: NestedChanges) => void
  isSubmitting?: boolean
}

function normalizeFieldValue(field: FormField, value: unknown) {
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

function guessOptionValue(item: Record<string, unknown>) {
  const keys = Object.keys(item)
  const normalized = keys.find((key) => key === 'id' || key.endsWith('_id') || key.startsWith('id_'))
  if (normalized && item[normalized] !== undefined) return String(item[normalized])
  const fallback = keys[0]
  return String(item[fallback])
}

function guessOptionLabel(item: Record<string, unknown>) {
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

function createOptionsFromRecords(records: Record<string, unknown>[]) {
  return records.map((record) => ({
    value: guessOptionValue(record),
    label: guessOptionLabel(record),
  }))
}

function interpolatePath(template: string, values: Record<string, unknown>) {
  return template.replace(/\{([^}]+)\}/g, (_, key) => {
    const raw = values[key]
    if (raw !== undefined && raw !== null) return String(raw)
    const fallback = Object.keys(values).find((candidate) => candidate.toLowerCase() === key.toLowerCase())
    if (fallback) return String(values[fallback] ?? '')
    return ''
  })
}

function fileToDataURL(file: File) {
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

export function EntityModal({ isOpen, title, fields, initialValues, onClose, onSubmit, isSubmitting = false }: EntityModalProps) {
  const [values, setValues] = useState<Record<string, unknown>>({})
  const [optionsByField, setOptionsByField] = useState<Record<string, SelectOption[]>>({})
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
      const response = await fetch(field.uploadEndpoint, {
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
      const response = await fetch(field.uploadEndpoint, {
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
            const labelText = field.required ? field.label : `${field.label} (opcional)`
            const baseProps = {
              id: field.key,
              required: field.required,
              placeholder: field.placeholder ?? labelText,
            }

            if (field.type === 'textarea') {
              return (
                <label key={field.key} className="field">
                  <span>{labelText}</span>
                  <textarea
                    {...baseProps}
                    value={String(value ?? '')}
                    onChange={(event) => handleChange(field.key, event.target.value)}
                  />
                </label>
              )
            }

            if (field.type === 'select') {
              const options = optionsByField[field.key] ?? field.options ?? []
              return (
                <label key={field.key} className="field">
                  <span>{labelText}</span>
                  <select
                    {...baseProps}
                    value={String(value ?? '')}
                    onChange={(event) => handleChange(field.key, event.target.value)}
                  >
                    <option value="">Selecciona una opción</option>
                    {options.map((option) => (
                      <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                  </select>
                </label>
              )
            }

            if (field.type === 'checkbox') {
              return (
                <label key={field.key} className="field checkbox-field">
                  <input
                    type="checkbox"
                    checked={Boolean(value)}
                    onChange={(event) => handleChange(field.key, event.target.checked)}
                  />
                  <span>{labelText}</span>
                </label>
              )
            }

            if (field.type === 'date') {
              return (
                <label key={field.key} className="field">
                  <span>{labelText}</span>
                  <input
                    {...baseProps}
                    type="date"
                    value={String(value ?? '')}
                    onChange={(event) => handleChange(field.key, event.target.value)}
                  />
                </label>
              )
            }

            if (field.type === 'number') {
              return (
                <label key={field.key} className="field">
                  <span>{labelText}</span>
                  <input
                    {...baseProps}
                    type="number"
                    value={String(value ?? '')}
                    onChange={(event) => handleChange(field.key, event.target.value)}
                  />
                </label>
              )
            }

            if (field.type === 'media') {
              const items = nestedItemsByField[field.key] ?? []
              const options = existingOptionsByField[field.key] ?? []
              const allowUrl = field.allowUrl ?? false
              const allowExisting = field.allowExisting ?? false
              const mode = mediaModeByField[field.key] ?? 'file'
              const canUseUrl = allowUrl && mode === 'url'
              const canUseExisting = allowExisting && mode === 'existing'
              const isDirect = !field.nestedEndpoint
              const previewValue = directMediaDataByField[field.key]?.fileData ?? String(value ?? '')
              const isVideoPreview = /^data:video\//i.test(previewValue) || /\.(mp4|webm|mov|ogg)$/i.test(previewValue)
              return (
                <div key={field.key} className="field media-field">
                  <span>{labelText}</span>
                  <div className="media-methods">
                    <button
                      type="button"
                      className={mode === 'file' ? 'media-method active' : 'media-method'}
                      onClick={() => setMediaModeByField((current) => ({ ...current, [field.key]: 'file' }))}
                    >Archivo</button>
                    {allowUrl ? (
                      <button
                        type="button"
                        className={mode === 'url' ? 'media-method active' : 'media-method'}
                        onClick={() => setMediaModeByField((current) => ({ ...current, [field.key]: 'url' }))}
                      >URL</button>
                    ) : null}
                    {allowExisting ? (
                      <button
                        type="button"
                        className={mode === 'existing' ? 'media-method active' : 'media-method'}
                        onClick={() => setMediaModeByField((current) => ({ ...current, [field.key]: 'existing' }))}
                      >Existente</button>
                    ) : null}
                  </div>
                  {mode === 'file' ? (
                    <input
                      ref={(element) => { fileInputRefs.current[field.key] = element }}
                      type="file"
                      accept={field.key === 'avatar_dir' ? 'image/*' : 'image/*,video/*'}
                    />
                  ) : null}
                  {canUseUrl ? (
                    <input
                      {...baseProps}
                      type="text"
                      value={mediaUrlByField[field.key] ?? ''}
                      onChange={(event) => setMediaUrlByField((current) => ({ ...current, [field.key]: event.target.value }))}
                    />
                  ) : null}
                  {canUseExisting ? (
                    <select
                      {...baseProps}
                      value={selectedExistingByField[field.key] ?? ''}
                      onChange={(event) => setSelectedExistingByField((current) => ({ ...current, [field.key]: event.target.value }))}
                    >
                      <option value="">Selecciona recurso existente</option>
                      {options.map((option) => (
                        <option key={option.value} value={option.value}>{option.label}</option>
                      ))}
                    </select>
                  ) : null}
                  <button type="button" className="secondary-action" onClick={() => void handleAddMedia(field)}>
                    Agregar recurso
                  </button>
                  {isDirect ? (
                    <div className="direct-resource-preview">
                      {previewValue ? (
                        field.key === 'avatar_dir' ? (
                          <img src={previewValue} alt="Vista previa" />
                        ) : isVideoPreview ? (
                          <video src={previewValue} controls className="preview-thumb-video" />
                        ) : (
                          <img src={previewValue} alt="Vista previa" />
                        )
                      ) : (
                        <div className="nested-list-empty">No hay recurso seleccionado.</div>
                      )}
                    </div>
                  ) : (
                    <div className="nested-list">
                      {items.length ? items.map((item) => (
                        <div key={String(item.id ?? String(item.media_dir))} className="nested-list-item">
                          <span>{String(item.media_dir ?? 'Sin ruta')}</span>
                          <button type="button" className="danger-action" onClick={() => handleRemoveNestedItem(field.key, item)}>Eliminar</button>
                        </div>
                      )) : (
                        <div className="nested-list-empty">No hay recursos agregados.</div>
                      )}
                    </div>
                  )}
                </div>
              )
            }

            if (field.type === 'subcrud') {
              const items = nestedItemsByField[field.key] ?? []
              const draft = nestedDraftByField[field.key] ?? {}
              return (
                <div key={field.key} className="field subcrud-field">
                  <span>{labelText}</span>
                  <div className="subcrud-fields">
                    {field.nestedFields?.map((nestedField) => (
                      <label key={nestedField.key} className="field nested-field">
                        <span>{nestedField.label}</span>
                        <input
                          id={`${field.key}-${nestedField.key}`}
                          placeholder={nestedField.placeholder ?? nestedField.label}
                          value={String(draft[nestedField.key] ?? '')}
                          onChange={(event) => handleNestedDraftChange(field.key, nestedField.key, event.target.value)}
                        />
                      </label>
                    ))}
                    <button type="button" className="secondary-action" onClick={() => handleAddSubcrudItem(field)}>
                      Agregar {field.label}
                    </button>
                  </div>
                  <div className="nested-list">
                    {items.length ? items.map((item) => (
                      <div key={String(item.id ?? JSON.stringify(item))} className="nested-list-item">
                        <span>{field.nestedFields?.map((nestedField) => String(item[nestedField.key] ?? '')).filter(Boolean).join(' • ') || 'Registro'}</span>
                        <button type="button" className="danger-action" onClick={() => handleRemoveNestedItem(field.key, item)}>Eliminar</button>
                      </div>
                    )) : (
                      <div className="nested-list-empty">No hay elementos agregados.</div>
                    )}
                  </div>
                </div>
              )
            }

            return (
              <label key={field.key} className="field">
                <span>{labelText}</span>
                <input
                  {...baseProps}
                  type="text"
                  value={String(value ?? '')}
                  onChange={(event) => handleChange(field.key, event.target.value)}
                />
              </label>
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
