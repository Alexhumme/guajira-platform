import type { FormField } from '../../types'
import type { SelectOption } from './types'

type FieldInputProps = {
  field: FormField
  value: unknown
  options: SelectOption[]
  onChange: (value: unknown) => void
}

export function FieldInput({ field, value, options, onChange }: FieldInputProps) {
  const labelText = field.required ? field.label : `${field.label} (opcional)`
  const baseProps = {
    id: field.key,
    required: field.required,
    placeholder: field.placeholder ?? labelText,
  }

  if (field.type === 'textarea') {
    return (
      <label className="field" htmlFor={field.key}>
        <span>{labelText}</span>
        <textarea {...baseProps} value={String(value ?? '')} onChange={(event) => onChange(event.target.value)} />
      </label>
    )
  }

  if (field.type === 'select') {
    return (
      <label className="field" htmlFor={field.key}>
        <span>{labelText}</span>
        <select {...baseProps} value={String(value ?? '')} onChange={(event) => onChange(event.target.value)}>
          <option value="">Selecciona una opción</option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </label>
    )
  }

  if (field.type === 'checkbox') {
    return (
      <label className="field checkbox-field" htmlFor={field.key}>
        <input type="checkbox" checked={Boolean(value)} onChange={(event) => onChange(event.target.checked)} />
        <span>{labelText}</span>
      </label>
    )
  }

  if (field.type === 'date') {
    return (
      <label className="field" htmlFor={field.key}>
        <span>{labelText}</span>
        <input
          {...baseProps}
          type="date"
          value={String(value ?? '')}
          onChange={(event) => onChange(event.target.value)}
        />
      </label>
    )
  }

  if (field.type === 'number') {
    return (
      <label className="field" htmlFor={field.key}>
        <span>{labelText}</span>
        <input
          {...baseProps}
          type="number"
          value={String(value ?? '')}
          onChange={(event) => onChange(event.target.value)}
        />
      </label>
    )
  }

  return (
    <label className="field" htmlFor={field.key}>
      <span>{labelText}</span>
      <input
        {...baseProps}
        type={field.type === 'password' ? 'password' : 'text'}
        value={String(value ?? '')}
        onChange={(event) => onChange(event.target.value)}
      />
    </label>
  )
}
