import { notFound } from 'next/navigation'
import { CommunityDetail } from '@/components/communities/community-detail'
import { getComunidadBySlug, getComunidades } from '@/lib/api/comunidades'
import { getMunicipios } from '@/lib/api/municipios'

export async function generateStaticParams() {
  const comunidades = await getComunidades()
  return comunidades.map((comunidad) => ({ slug: comunidad.slug }))
}

export default async function ComunidadPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const comunidad = await getComunidadBySlug(slug)
  if (!comunidad) notFound()

  const municipio = (await getMunicipios()).find((m) => m.id === comunidad.municipioId)

  return <CommunityDetail comunidad={comunidad} municipio={municipio} />
}
