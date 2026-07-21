'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { Heart, MessageCircle, Share2 } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import {
  getComunidad,
  getProductoById,
  type Publicacion,
} from '@/lib/data'
import { cn } from '@/lib/utils'

export function PublicationCard({ publicacion }: { publicacion: Publicacion }) {
  const comunidad = getComunidad(publicacion.comunidadId)
  const [liked, setLiked] = useState(false)
  const likes = publicacion.likes + (liked ? 1 : 0)
  const fecha = new Date(publicacion.fecha).toLocaleDateString('es-CO', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  return (
    <article className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
      <div className="flex items-center gap-3 p-4">
        <span className="relative size-10 overflow-hidden rounded-full bg-muted">
          <Image src={publicacion.avatar} alt={publicacion.autor} fill className="object-cover" />
        </span>
        <div className="min-w-0">
          <p className="truncate font-medium">{publicacion.autor}</p>
          <p className="text-xs text-muted-foreground">
            {comunidad && (
              <Link href={`/comunidades/${comunidad.slug}`} className="hover:text-primary">
                {comunidad.nombre}
              </Link>
            )}{' '}
            · {fecha}
          </p>
        </div>
      </div>

      <p className="px-4 pb-3 text-sm leading-relaxed text-pretty">{publicacion.contenido}</p>

      {publicacion.imagenes.length > 0 && (
        <div
          className={cn(
            'grid gap-0.5',
            publicacion.imagenes.length > 1 ? 'grid-cols-2' : 'grid-cols-1',
          )}
        >
          {publicacion.imagenes.map((img, i) => (
            <div key={i} className="relative aspect-[4/3] bg-muted">
              <Image src={img} alt="" fill sizes="50vw" className="object-cover" />
            </div>
          ))}
        </div>
      )}

      {publicacion.productosRelacionados.length > 0 && (
        <div className="flex flex-wrap gap-2 px-4 pt-3">
          {publicacion.productosRelacionados.map((pid) => {
            const prod = getProductoById(pid)
            if (!prod) return null
            return (
              <Link key={pid} href={`/marketplace/${prod.slug}`}>
                <Badge variant="clay">Producto: {prod.nombre}</Badge>
              </Link>
            )
          })}
        </div>
      )}

      <div className="flex items-center gap-5 p-4 text-sm text-muted-foreground">
        <button
          type="button"
          onClick={() => setLiked((v) => !v)}
          className={cn('flex items-center gap-1.5 transition-colors hover:text-primary', liked && 'text-primary')}
        >
          <Heart className={cn('size-4', liked && 'fill-current')} /> {likes}
        </button>
        <button type="button" className="ml-auto flex items-center gap-1.5 transition-colors hover:text-primary">
          <Share2 className="size-4" /> Compartir
        </button>
      </div>
    </article>
  )
}
