'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { MapPin, ArrowRight } from 'lucide-react'
import { mapPoints, type MapPoint } from '@/lib/data'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

const tipoColors: Record<MapPoint['tipo'], string> = {
  Comunidad: 'bg-primary',
  Ruta: 'bg-clay',
  'Turístico': 'bg-amber-600',
  Artesanal: 'bg-rose-700',
  Playa: 'bg-teal-600',
  Cultural: 'bg-emerald-700',
}

export function InteractiveMap({ compact = false }: { compact?: boolean }) {
  const [active, setActive] = useState<MapPoint | null>(mapPoints[2])

  return (
    <div className={cn('grid gap-6', !compact && 'lg:grid-cols-[1.6fr_1fr]')}>
      <div className="relative aspect-[4/3] overflow-hidden rounded-xl border border-border bg-secondary">
        <Image src="/images/map-guajira.png" alt="Mapa de La Guajira" fill className="object-cover" />
        {mapPoints.map((point) => (
          <button
            key={point.id}
            type="button"
            onClick={() => setActive(point)}
            aria-label={point.nombre}
            className="group absolute -translate-x-1/2 -translate-y-1/2"
            style={{ left: `${point.x}%`, top: `${point.y}%` }}
          >
            <span
              className={cn(
                'flex size-5 items-center justify-center rounded-full ring-2 ring-white transition-transform group-hover:scale-125',
                tipoColors[point.tipo],
                active?.id === point.id && 'scale-125',
              )}
            >
              <MapPin className="size-3 text-white" />
            </span>
            {active?.id === point.id && (
              <span className="absolute left-1/2 top-6 -translate-x-1/2 whitespace-nowrap rounded bg-foreground px-2 py-0.5 text-[10px] font-medium text-background">
                {point.nombre}
              </span>
            )}
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-4">
        {active ? (
          <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
            <div className="relative aspect-[16/9] bg-muted">
              <Image src={active.imagen} alt={active.nombre} fill className="object-cover" />
            </div>
            <div className="p-4">
              <Badge variant="clay">{active.tipo}</Badge>
              <h3 className="mt-2 font-serif text-lg font-bold">{active.nombre}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{active.descripcion}</p>
              <Link
                href={active.href}
                className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
              >
                Ver más <ArrowRight className="size-4" />
              </Link>
            </div>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">Selecciona un punto en el mapa.</p>
        )}

        <div className="flex flex-wrap gap-2">
          {(Object.keys(tipoColors) as MapPoint['tipo'][]).map((tipo) => (
            <span key={tipo} className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <span className={cn('size-2.5 rounded-full', tipoColors[tipo])} /> {tipo}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
