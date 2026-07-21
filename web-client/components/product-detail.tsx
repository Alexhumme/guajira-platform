'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { MessageCircle, Package, Users } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { formatCOP, getComunidad, type Producto } from '@/lib/data'

export function ProductDetail({ producto }: { producto: Producto }) {
  const [active, setActive] = useState(0)
  const comunidad = getComunidad(producto.comunidadId)

  return (
    <div className="grid gap-10 lg:grid-cols-2">
      <div>
        <div className="relative aspect-square overflow-hidden rounded-xl border border-border bg-muted">
          <Image
            src={producto.imagenes[active] || '/placeholder.svg'}
            alt={producto.nombre}
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover"
          />
        </div>
        {producto.imagenes.length > 1 && (
          <div className="mt-3 flex gap-3">
            {producto.imagenes.map((img, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setActive(i)}
                className={cn(
                  'relative size-20 overflow-hidden rounded-lg border-2 bg-muted',
                  active === i ? 'border-primary' : 'border-transparent',
                )}
              >
                <Image src={img} alt="" fill className="object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>

      <div>
        <Badge variant="secondary">{producto.categoria}</Badge>
        <h1 className="mt-3 font-serif text-3xl font-bold text-balance">{producto.nombre}</h1>
        {comunidad && (
          <Link
            href={`/comunidades/${comunidad.slug}`}
            className="mt-1 inline-block text-sm text-muted-foreground hover:text-primary"
          >
            {comunidad.nombre}
          </Link>
        )}
        <p className="mt-4 text-2xl font-bold text-primary">{formatCOP(producto.precio)}</p>
        <div className="mt-2">

        </div>

        <p className="mt-5 leading-relaxed text-pretty text-muted-foreground">{producto.descripcion}</p>

        <div className="mt-6 grid gap-3 text-sm">
          <div className="flex items-center gap-2 rounded-lg border border-border p-3">
            <Package className="size-4 text-primary" />
            <span>Categoría: {producto.categoria}</span>
          </div>
          <div className="flex items-center gap-2 rounded-lg border border-border p-3">
            <Users className="size-4 text-primary" />
            <span>Artesano/a: {producto.artesano}</span>
          </div>
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <Button size="lg" className="h-11 px-5">
            <MessageCircle className="size-4" /> Contactar al productor
          </Button>
          {comunidad && (
            <Button size="lg" variant="outline" className="h-11 px-5" render={<Link href={`/comunidades/${comunidad.slug}`} />}>
              Ver comunidad
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
