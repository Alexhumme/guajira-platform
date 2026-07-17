import Link from 'next/link'
import Image from 'next/image'
import { Badge } from '@/components/ui/badge'
import { formatCOP, getComunidad, type Producto } from '@/lib/data'

export function ProductCard({ producto }: { producto: Producto }) {
  const comunidad = getComunidad(producto.comunidadId)
  return (
    <Link
      href={`/marketplace/${producto.slug}`}
      className="group flex flex-col overflow-hidden rounded-xl border border-border bg-card shadow-sm transition-all hover:-translate-y-1 hover:shadow-md"
    >
      <div className="relative aspect-square overflow-hidden bg-muted">
        <Image
          src={producto.imagenes[0] || '/placeholder.svg'}
          alt={producto.nombre}
          fill
          sizes="(max-width: 768px) 50vw, 25vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <Badge className="absolute left-3 top-3" variant="secondary">
          {producto.categoria}
        </Badge>
      </div>
      <div className="flex flex-1 flex-col gap-1 p-4">
        <h3 className="font-serif text-base font-semibold leading-tight text-balance">
          {producto.nombre}
        </h3>
        <p className="text-xs text-muted-foreground">{comunidad?.nombre}</p>
        <div className="mt-auto flex items-center justify-between pt-3">
          <span className="font-semibold text-primary">{formatCOP(producto.precio)}</span>
          <Badge
            variant={producto.disponibilidad === 'Disponible' ? 'success' : 'muted'}
            className="text-[10px]"
          >
            {producto.disponibilidad}
          </Badge>
        </div>
      </div>
    </Link>
  )
}
