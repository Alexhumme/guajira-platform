'use client'

import { notFound, useParams } from 'next/navigation'
import { ProductDetail } from '@/components/products/product-detail'
import { useProductos } from '@/hooks/useProductos'
import { useComunidades } from '@/hooks/useComunidades'

export function ProductoPageClient() {
  const params = useParams<{ slug: string }>()
  const slug = Array.isArray(params.slug) ? params.slug[0] : params.slug
  const { productos, isLoading } = useProductos()
  const { comunidades } = useComunidades()

  if (isLoading) {
    return <div className="mx-auto max-w-7xl px-4 py-20 text-center text-muted-foreground">Cargando…</div>
  }

  const producto = productos.find((p) => p.slug === slug)
  if (!producto) notFound()

  const comunidad = comunidades.find((item) => item.id === producto.comunidadId)

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 md:py-14">
      <ProductDetail producto={producto} comunidad={comunidad} />
    </div>
  )
}
