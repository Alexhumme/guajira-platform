import type { Metadata } from "next"
import { comunidades, municipios } from "@/lib/data"
import { PageHero } from "@/components/page-hero"
import { CommunityCard } from "@/components/community-card"
import { WayuuDivider } from "@/components/wayuu-divider"

export const metadata: Metadata = {
  title: "Comunidades | IAP La Guajira",
  description: "Conoce las comunidades Wayuu que hacen parte del proyecto IAP en La Guajira.",
}

export default function ComunidadesPage() {
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
            return <CommunityCard key={c.id} comunidad={c} municipio={municipio?.nombre} />
          })}
        </div>
      </section>
    </>
  )
}
