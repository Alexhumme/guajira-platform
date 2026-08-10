type ListToolbarProps = {
  title: string
  subtitle: string
  query: string
  onQueryChange: (value: string) => void
  onAdd?: () => void
  canAdd?: boolean
}

export function ListToolbar({ title, subtitle, query, onQueryChange, onAdd, canAdd = true }: ListToolbarProps) {
  return (
    <div className="panel-toolbar">
      <div>
        <h3>{title}</h3>
        <p className="panel-subtitle">{subtitle}</p>
      </div>
      <div className="toolbar-actions">
        <input value={query} onChange={(event) => onQueryChange(event.target.value)} placeholder="Buscar en la tabla" />
        {canAdd && onAdd ? (
          <button className="primary-action" type="button" onClick={onAdd}>
            Agregar
          </button>
        ) : null}
      </div>
    </div>
  )
}
