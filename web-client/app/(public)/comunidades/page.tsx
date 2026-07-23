import type { Metadata } from 'next'
import { PageHero } from '@/components/page-hero'
import { CommunityCard } from '@/components/community-card'
import { WayuuDivider } from '@/components/wayuu-divider'
import { getComunidades } from '@/lib/api/comunidades'
import { getMunicipios } from '@/lib/api/municipios'

export const metadata: Metadata = {
  title: 'Comunidades | IAP La Guajira',
  description: 'Conoce las comunidades Wayuu que hacen parte del proyecto IAP en La Guajira.',
}

export default async function ComunidadesPage() {
  const comunidades = await getComunidades()
  const municipios = await getMunicipios()

  return (
    <>
      <PageHero
        eyebrow="Nuestra gente"
        title="Comunidades Wayuu participantes"
        description="Cada comunidad conserva un saber propio: el tejido, la sal, la pesca o el pastoreo. Conócelas y apoya su trabajo."
        image="/images/community-1.png"
      />
      <WayuuDivider />
      <section className="mx-auto max-w-6xl px-4 py-12 md:py-16">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {comunidades.map((c) => {
            const municipio = municipios.find((m) => m.id === c.municipioId)
            return <CommunityCard key={c.id} comunidad={c} municipio={municipio} />
          })}
        </div>
      </section>
    </>
  )
}
