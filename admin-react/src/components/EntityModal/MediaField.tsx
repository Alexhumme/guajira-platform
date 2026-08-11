import type { FormField } from '../../types'
import type { NestedItem, SelectOption } from './types'

type MediaFieldProps = {
  field: FormField
  value: unknown
  options: SelectOption[]
  mode: 'file' | 'url' | 'existing'
  mediaUrl: string
  selectedExisting: string
  nestedItems: NestedItem[]
  directMediaData?: { fileData?: string; fileName?: string }
  fileInputRef: (element: HTMLInputElement | null) => void
  onModeChange: (mode: 'file' | 'url' | 'existing') => void
  onMediaUrlChange: (value: string) => void
  onSelectedExistingChange: (value: string) => void
  onAddMedia: () => void
  onRemoveNestedItem: (item: NestedItem) => void
}

export function MediaField({
  field,
  value,
  options,
  mode,
  mediaUrl,
  selectedExisting,
  nestedItems,
  directMediaData,
  fileInputRef,
  onModeChange,
  onMediaUrlChange,
  onSelectedExistingChange,
  onAddMedia,
  onRemoveNestedItem,
}: MediaFieldProps) {
  const allowUrl = field.allowUrl ?? false
  const allowExisting = field.allowExisting ?? false
  const isDirect = !field.nestedEndpoint
  const previewValue = directMediaData?.fileData ?? String(value ?? '')
  const isVideoPreview = /^data:video\//i.test(previewValue) || /\.(mp4|webm|mov|ogg)$/i.test(previewValue)
  const labelText = field.required ? field.label : `${field.label} (opcional)`

  return (
    <div className="field media-field">
      <span>{labelText}</span>
      <div className="media-methods">
        <button type="button" className={mode === 'file' ? 'media-method active' : 'media-method'} onClick={() => onModeChange('file')}>
          Archivo
        </button>
        {allowUrl ? (
          <button type="button" className={mode === 'url' ? 'media-method active' : 'media-method'} onClick={() => onModeChange('url')}>
            URL
          </button>
        ) : null}
        {allowExisting ? (
          <button type="button" className={mode === 'existing' ? 'media-method active' : 'media-method'} onClick={() => onModeChange('existing')}>
            Existente
          </button>
        ) : null}
      </div>

      {mode === 'file' ? (
        <input ref={fileInputRef} type="file" accept={field.key === 'avatar_dir' ? 'image/*' : 'image/*,video/*'} />
      ) : null}

      {allowUrl && mode === 'url' ? (
        <input
          id={field.key}
          required={field.required}
          placeholder={field.placeholder ?? labelText}
          type="text"
          value={mediaUrl}
          onChange={(event) => onMediaUrlChange(event.target.value)}
        />
      ) : null}

      {allowExisting && mode === 'existing' ? (
        <select id={field.key} value={selectedExisting} onChange={(event) => onSelectedExistingChange(event.target.value)}>
          <option value="">Selecciona recurso existente</option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      ) : null}

      <button type="button" className="secondary-action" onClick={onAddMedia}>
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
          {nestedItems.length ? nestedItems.map((item) => (
            <div key={String(item.id ?? String(item.media_dir))} className="nested-list-item">
              <span>{String(item.media_dir ?? 'Sin ruta')}</span>
              <button type="button" className="danger-action" onClick={() => onRemoveNestedItem(item)}>
                Eliminar
              </button>
            </div>
          )) : (
            <div className="nested-list-empty">No hay recursos agregados.</div>
          )}
        </div>
      )}
    </div>
  )
}
