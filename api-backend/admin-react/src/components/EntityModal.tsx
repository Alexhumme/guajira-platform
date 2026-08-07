import { useEffect, useMemo, useState, type FormEvent } from 'react'
import type { FormField } from '../types'

// Modal simple para crear o editar un registro sin depender de librerías externas.
type EntityModalProps = {
  isOpen: boolean
  title: string
  fields: FormField[]
  initialValues: Record<string, unknown>
  onClose: () => void
  onSubmit: (payload: Record<string, unknown>) => void
  isSubmitting?: boolean
}

function normalizeFieldValue(field: FormField, value: unknown) {
  if (field.type === 'checkbox') return Boolean(value)
  if (field.type === 'number') {
    if (value === '' || value === null || value === undefined) return ''
    return Number(value)
  }
  if (field.type === 'date') return value ?? ''
  return value ?? ''
}

export function EntityModal({ isOpen, title, fields, initialValues, onClose, onSubmit, isSubmitting = false }: EntityModalProps) {
  const [values, setValues] = useState<Record<string, unknown>>({})

  useEffect(() => {
    if (!isOpen) return

    const nextValues = fields.reduce<Record<string, unknown>>((accumulator, field) => {
      const fallback = field.defaultValue ?? ''
      accumulator[field.key] = normalizeFieldValue(field, initialValues[field.key] ?? fallback)
      return accumulator
    }, {})

    setValues(nextValues)
  }, [fields, initialValues, isOpen])

  const isDisabled = useMemo(() => isSubmitting, [isSubmitting])

  if (!isOpen) return null

  function handleChange(key: string, value: unknown) {
    setValues((current) => ({ ...current, [key]: value }))
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const payload = Object.entries(values).reduce<Record<string, unknown>>((accumulator, [key, value]) => {
      accumulator[key] = value
      return accumulator
    }, {})
    onSubmit(payload)
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
            const baseProps = {
              id: field.key,
              required: field.required,
              placeholder: field.placeholder ?? field.label,
            }

            if (field.type === 'textarea') {
              return (
                <label key={field.key} className="field">
                  <span>{field.label}</span>
                  <textarea
                    {...baseProps}
                    value={String(value ?? '')}
                    onChange={(event) => handleChange(field.key, event.target.value)}
                  />
                </label>
              )
            }

            if (field.type === 'select') {
              return (
                <label key={field.key} className="field">
                  <span>{field.label}</span>
                  <select
                    {...baseProps}
                    value={String(value ?? '')}
                    onChange={(event) => handleChange(field.key, event.target.value)}
                  >
                    {field.options?.map((option) => (
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
                  <span>{field.label}</span>
                </label>
              )
            }

            if (field.type === 'date') {
              return (
                <label key={field.key} className="field">
                  <span>{field.label}</span>
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
                  <span>{field.label}</span>
                  <input
                    {...baseProps}
                    type="number"
                    value={String(value ?? '')}
                    onChange={(event) => handleChange(field.key, event.target.value)}
                  />
                </label>
              )
            }

            return (
              <label key={field.key} className="field">
                <span>{field.label}</span>
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
