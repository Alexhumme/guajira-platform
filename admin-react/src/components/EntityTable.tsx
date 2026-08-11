import type { ColumnDefinition, SectionKey } from '../types'
import type { ReactNode } from 'react'

type EntityTableProps = {
  rows: Record<string, unknown>[]
  columns: ColumnDefinition[]
  entityIdKey: string
  currentSectionKey: SectionKey
  onEdit: (row: Record<string, unknown>) => void
  onDelete: (row: Record<string, unknown>) => void
  onViewPost?: (row: Record<string, unknown>) => void
  formatValue: (value: unknown) => ReactNode
  resolveApiPath: (path: string) => string
}

export function EntityTable({
  rows,
  columns,
  entityIdKey,
  currentSectionKey,
  onEdit,
  onDelete,
  onViewPost,
  formatValue,
  resolveApiPath,
}: EntityTableProps) {
  function renderCell(column: ColumnDefinition, row: Record<string, unknown>) {
    const value = row[column.key]
    if (currentSectionKey === 'miembros' && column.key === 'avatar_dir') {
      const src = String(row.avatar_dir ?? '')
      const resolvedSrc = src ? resolveApiPath(src) : ''
      return resolvedSrc ? (
        <img src={resolvedSrc} alt="Avatar" style={{ width: 32, height: 32, borderRadius: '999px', objectFit: 'cover' }} />
      ) : (
        '—'
      )
    }
    if (column.render) return column.render(row)
    return formatValue(value)
  }

  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            {columns.map((column) => (
              <th key={column.key}>{column.label}</th>
            ))}
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {rows.length ? rows.map((row, index) => (
            <tr key={`${String(row[entityIdKey] ?? index)}`}>
              {columns.map((column) => (
                <td key={column.key}>{renderCell(column, row)}</td>
              ))}
              <td>
                <div className="row-actions">
                  {currentSectionKey === 'posts' && onViewPost ? (
                    <button className="secondary-action" type="button" onClick={() => onViewPost(row)}>
                      Ver
                    </button>
                  ) : null}
                  <button className="secondary-action" type="button" onClick={() => onEdit(row)}>
                    Editar
                  </button>
                  <button className="danger-action" type="button" onClick={() => onDelete(row)}>
                    Eliminar
                  </button>
                </div>
              </td>
            </tr>
          )) : (
            <tr>
              <td colSpan={columns.length + 1} className="empty-row">
                No hay registros para mostrar.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}
