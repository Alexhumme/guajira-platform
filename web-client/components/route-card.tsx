import Link from 'next/link'
import Image from 'next/image'
import { Clock, Route as RouteIcon, Gauge } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { getMunicipio, type RutaTuristica } from '@/lib/data'

export function RouteCard({ ruta }: { ruta: RutaTuristica }) {
  const municipio = getMunicipio(ruta.municipioId)
  return (
    <Link
      href={`/turismo/${ruta.slug}`}
      className="group flex flex-col overflow-hidden rounded-xl border border-border bg-card shadow-sm transition-all hover:-translate-y-1 hover:shadow-md"
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-muted">
        <Image
          src={ruta.portada || '/placeholder.svg'}
          alt={ruta.nombre}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <Badge className="absolute left-3 top-3">{ruta.tipoExperiencia}</Badge>
      </div>
      <div className="flex flex-1 flex-col p-5">
        <h3 className="font-serif text-lg font-bold leading-tight text-balance">{ruta.nombre}</h3>
        <p className="mt-1 text-xs text-muted-foreground">{municipio?.nombre}</p>
        <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{ruta.descripcion}</p>
        <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-1"><Clock className="size-3.5 text-primary" /> {ruta.duracion}</span>
          <span className="flex items-center gap-1"><RouteIcon className="size-3.5 text-primary" /> {ruta.distancia}</span>
          <span className="flex items-center gap-1"><Gauge className="size-3.5 text-primary" /> {ruta.dificultad}</span>
        </div>
      </div>
    </Link>
  )
}
