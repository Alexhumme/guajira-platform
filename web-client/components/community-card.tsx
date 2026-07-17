import Link from 'next/link'
import Image from 'next/image'
import { MapPin, Package, Users } from 'lucide-react'
import {
  getMunicipio,
  productosByComunidad,
  type Comunidad,
} from '@/lib/data'

export function CommunityCard({ comunidad }: { comunidad: Comunidad }) {
  const municipio = getMunicipio(comunidad.municipioId)
  const totalProductos = productosByComunidad(comunidad.id).length
  return (
    <Link
      href={`/comunidades/${comunidad.slug}`}
      className="group flex flex-col overflow-hidden rounded-xl border border-border bg-card shadow-sm transition-all hover:-translate-y-1 hover:shadow-md"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-muted">
        <Image
          src={comunidad.portada || '/placeholder.svg'}
          alt={comunidad.nombre}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/70 to-transparent" />
        <div className="absolute bottom-3 left-4 right-4 text-white">
          <h3 className="font-serif text-lg font-bold text-balance">{comunidad.nombre}</h3>
          <p className="flex items-center gap-1 text-xs text-white/85">
            <MapPin className="size-3.5" /> {municipio?.nombre}, {municipio?.departamento}
          </p>
        </div>
      </div>
      <div className="flex flex-1 flex-col p-4">
        <p className="line-clamp-2 text-sm text-muted-foreground">{comunidad.descripcion}</p>
        <div className="mt-4 flex items-center gap-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-1"><Package className="size-3.5 text-primary" /> {totalProductos} productos</span>
          <span className="flex items-center gap-1"><Users className="size-3.5 text-primary" /> {comunidad.familias} familias</span>
        </div>
      </div>
    </Link>
  )
}
