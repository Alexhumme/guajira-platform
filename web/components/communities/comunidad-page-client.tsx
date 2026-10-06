'use client'

import { notFound, useParams } from 'next/navigation'
import { CommunityDetail } from '@/components/communities/community-detail'
import { useComunidades } from '@/hooks/useComunidades'
import { useMunicipios } from '@/hooks/useMunicipios'

export function ComunidadPageClient() {
  const params = useParams<{ slug: string }>()
  const slug = Array.isArray(params.slug) ? params.slug[0] : params.slug
  const { comunidades, isLoading } = useComunidades()
  const { municipios } = useMunicipios()

  if (isLoading) {
    return <div className="mx-auto max-w-7xl px-4 py-20 text-center text-muted-foreground">Cargando…</div>
  }

  const comunidad = comunidades.find((c) => c.slug === slug)
  if (!comunidad) notFound()

  const municipio = municipios.find((m) => m.id === comunidad.municipioId)
  const municipioInfo = municipio ? { nombre: municipio.nombre, departamento: municipio.departamento } : undefined

  return <CommunityDetail comunidad={comunidad} municipio={municipioInfo} />
}
