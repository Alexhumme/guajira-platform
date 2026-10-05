import { getComunidades } from '@/lib/api/comunidades'
import { ComunidadPageClient } from '@/components/communities/comunidad-page-client'

export async function generateStaticParams() {
  const comunidades = await getComunidades()
  return comunidades.map((comunidad) => ({ slug: comunidad.slug }))
}

export default async function ComunidadPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  return <ComunidadPageClient slug={slug} />
}
