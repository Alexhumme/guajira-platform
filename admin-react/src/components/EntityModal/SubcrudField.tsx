import type { FormField } from '../../types'
import type { NestedItem, SelectOption } from './types'

type SubcrudFieldProps = {
  field: FormField
  items: NestedItem[]
  draft: Record<string, unknown>
  optionsByField: Record<string, SelectOption[]>
  onDraftChange: (fieldKey: string, value: unknown) => void
  onAdd: () => void
  onRemove: (item: NestedItem) => void
}

export function SubcrudField({ field, items, draft, optionsByField, onDraftChange, onAdd, onRemove }: SubcrudFieldProps) {
  const labelText = field.required ? field.label : `${field.label} (opcional)`
  const itemLabel = (item: NestedItem) => field.nestedFields
    ?.map((nestedField) => {
      const value = item[nestedField.key]
      if (!value) return ''

      if (nestedField.type === 'select') {
        const option = (optionsByField[nestedField.key] ?? nestedField.options ?? [])
          .find((candidate) => candidate.value === String(value))
        return option?.label ?? String(value)
      }

      return String(value)
    })
    .filter(Boolean)
    .join(' • ') || 'Registro'

  return (
    <div className="field subcrud-field">
      <div className="subcrud-header">
        <h4>{labelText}</h4>
        <p>Agrega y administra los registros vinculados.</p>
      </div>
      <div className="subcrud-fields">
        {field.nestedFields?.map((nestedField) => (
          <label key={nestedField.key} className="field nested-field" htmlFor={`${field.key}-${nestedField.key}`}>
            <span>{nestedField.label}</span>
            {nestedField.type === 'select' ? (
              <select
                id={`${field.key}-${nestedField.key}`}
                value={String(draft[nestedField.key] ?? '')}
                onChange={(event) => onDraftChange(nestedField.key, event.target.value)}
              >
                <option value="">Selecciona una opción</option>
                {(optionsByField[nestedField.key] ?? nestedField.options ?? []).map((option) => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            ) : (
              <input
                id={`${field.key}-${nestedField.key}`}
                placeholder={nestedField.placeholder ?? nestedField.label}
                value={String(draft[nestedField.key] ?? '')}
                onChange={(event) => onDraftChange(nestedField.key, event.target.value)}
              />
            )}
          </label>
        ))}
        <button type="button" className="secondary-action" onClick={onAdd}>
          Agregar {field.label}
        </button>
      </div>
      <div className="nested-list">
        {items.length ? items.map((item) => (
          <div key={String(item.id ?? JSON.stringify(item))} className="nested-list-item">
            <span>{itemLabel(item)}</span>
            <button type="button" className="danger-action" onClick={() => onRemove(item)}>
              Eliminar
            </button>
          </div>
        )) : (
          <div className="nested-list-empty">No hay elementos agregados.</div>
        )}
      </div>
    </div>
  )
}
