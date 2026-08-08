import type { FormField } from '../../types'
import type { NestedItem } from './types'

type SubcrudFieldProps = {
  field: FormField
  items: NestedItem[]
  draft: Record<string, unknown>
  onDraftChange: (fieldKey: string, value: unknown) => void
  onAdd: () => void
  onRemove: (item: NestedItem) => void
}

export function SubcrudField({ field, items, draft, onDraftChange, onAdd, onRemove }: SubcrudFieldProps) {
  const labelText = field.required ? field.label : `${field.label} (opcional)`

  return (
    <div className="field subcrud-field">
      <span>{labelText}</span>
      <div className="subcrud-fields">
        {field.nestedFields?.map((nestedField) => (
          <label key={nestedField.key} className="field nested-field" htmlFor={`${field.key}-${nestedField.key}`}>
            <span>{nestedField.label}</span>
            <input
              id={`${field.key}-${nestedField.key}`}
              placeholder={nestedField.placeholder ?? nestedField.label}
              value={String(draft[nestedField.key] ?? '')}
              onChange={(event) => onDraftChange(nestedField.key, event.target.value)}
            />
          </label>
        ))}
        <button type="button" className="secondary-action" onClick={onAdd}>
          Agregar {field.label}
        </button>
      </div>
      <div className="nested-list">
        {items.length ? items.map((item) => (
          <div key={String(item.id ?? JSON.stringify(item))} className="nested-list-item">
            <span>{field.nestedFields?.map((nestedField) => String(item[nestedField.key] ?? '')).filter(Boolean).join(' • ') || 'Registro'}</span>
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
