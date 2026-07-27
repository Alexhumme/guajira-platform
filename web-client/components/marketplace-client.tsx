'use client'

import { useMemo, useState } from 'react'
import { Search, SlidersHorizontal, X } from 'lucide-react'
import { ProductCard } from '@/components/product-card'
import { Input, Select } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useProductos } from '@/hooks/useProductos'
import { useComunidades } from '@/hooks/useComunidades'
import { useMunicipios } from '@/hooks/useMunicipios'

export function MarketplaceClient() {
  const { productos, isLoading, error } = useProductos()
  const { comunidades } = useComunidades()
  const { municipios } = useMunicipios()
  const [query, setQuery] = useState('')
  const [categoria, setCategoria] = useState('')
  const [comunidad, setComunidad] = useState('')
  const [municipio, setMunicipio] = useState('')
  const [precio, setPrecio] = useState<number | null>(null)
  const [showFilters, setShowFilters] = useState(false)

  const maxPrecio = useMemo(() => Math.max(0, ...productos.map((producto) => producto.precio)), [productos])
  const categorias = useMemo(
    () => Array.from(new Set(productos.map((producto) => producto.categoria))).sort(),
    [productos],
  )

  const filtrados = useMemo(() => {
    return productos.filter((p) => {
      const comu = comunidades.find((c) => c.id === p.comunidadId)
      if (query && !p.nombre.toLowerCase().includes(query.toLowerCase())) return false
      if (categoria && p.categoria !== categoria) return false
      if (comunidad && p.comunidadId !== comunidad) return false
      if (municipio && comu?.municipioId !== municipio) return false
      if (precio !== null && p.precio > precio) return false
      return true
    })
  }, [query, categoria, comunidad, municipio, precio])

  const resetFilters = () => {
    setQuery('')
    setCategoria('')
    setComunidad('')
    setMunicipio('')
    setPrecio(null)
  }

  const filters = (
    <div className="flex flex-col gap-5">
      <div>
        <label className="mb-1.5 block text-sm font-medium">Categoría</label>
        <Select value={categoria} onChange={(e) => setCategoria(e.target.value)}>
          <option value="">Todas</option>
          {categorias.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </Select>
      </div>
      <div>
        <label className="mb-1.5 block text-sm font-medium">Comunidad</label>
        <Select value={comunidad} onChange={(e) => setComunidad(e.target.value)}>
          <option value="">Todas</option>
          {comunidades.map((c) => (
            <option key={c.id} value={c.id}>{c.nombre}</option>
          ))}
        </Select>
      </div>
      <div>
        <label className="mb-1.5 block text-sm font-medium">Municipio</label>
        <Select value={municipio} onChange={(e) => setMunicipio(e.target.value)}>
          <option value="">Todos</option>
          {municipios.map((m) => (
            <option key={m.id} value={m.id}>{m.nombre}</option>
          ))}
        </Select>
      </div>
      <div>
        <label className="mb-1.5 block text-sm font-medium">
          Precio máximo: {new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(precio ?? maxPrecio)}
        </label>
        <input
          type="range"
          min={0}
          max={maxPrecio}
          step={1000}
          value={precio ?? maxPrecio}
          onChange={(e) => setPrecio(Number(e.target.value))}
          className="w-full accent-[var(--primary)]"
        />
      </div>
      <Button variant="ghost" onClick={resetFilters} className="justify-start">
        <X className="size-4" /> Limpiar filtros
      </Button>
    </div>
  )

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <div className="relative mb-6 max-w-md">
        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Buscar productos..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pl-9"
        />
      </div>

      <div className="mb-4 flex items-center justify-between lg:hidden">
        <Button variant="outline" onClick={() => setShowFilters((v) => !v)}>
          <SlidersHorizontal className="size-4" /> Filtros
        </Button>
        <span className="text-sm text-muted-foreground">{filtrados.length} resultados</span>
      </div>

      <div className="grid gap-8 lg:grid-cols-[240px_1fr]">
        <aside className="hidden lg:block">
          <div className="sticky top-24 rounded-xl border border-border bg-card p-5 shadow-sm">
            <h2 className="mb-4 font-serif text-lg font-semibold">Filtros</h2>
            {filters}
          </div>
        </aside>

        {showFilters && (
          <div className="rounded-xl border border-border bg-card p-5 shadow-sm lg:hidden">
            {filters}
          </div>
        )}

        <div>
          <p className="mb-4 hidden text-sm text-muted-foreground lg:block">
            {filtrados.length} productos encontrados
          </p>
          {isLoading ? (
            <div className="rounded-xl border border-dashed border-border p-12 text-center text-muted-foreground">
              Cargando productos...
            </div>
          ) : error ? (
            <div className="rounded-xl border border-dashed border-border p-12 text-center text-muted-foreground">
              No fue posible cargar los productos.
            </div>
          ) : filtrados.length > 0 ? (
            <div className="grid grid-cols-2 gap-5 lg:grid-cols-3 xl:grid-cols-4">
              {filtrados.map((p) => (
                <ProductCard key={p.id} producto={p} />
              ))}
            </div>
          ) : (
            <div className="rounded-xl border border-dashed border-border p-12 text-center text-muted-foreground">
              No se encontraron productos con los filtros seleccionados.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
