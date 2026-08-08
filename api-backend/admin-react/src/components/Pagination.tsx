type PaginationProps = {
  page: number
  totalPages: number
  onPageChange: (page: number) => void
}

export function Pagination({ page, totalPages, onPageChange }: PaginationProps) {
  return (
    <div className="pagination">
      <button disabled={page === 1} type="button" onClick={() => onPageChange(Math.max(1, page - 1))}>
        Anterior
      </button>
      <span>Página {page} de {totalPages}</span>
      <button disabled={page === totalPages} type="button" onClick={() => onPageChange(Math.min(totalPages, page + 1))}>
        Siguiente
      </button>
    </div>
  )
}
