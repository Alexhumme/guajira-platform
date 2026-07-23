import Link from 'next/link'
import { ArrowRight, Compass, Handshake, Leaf, ShoppingBag } from 'lucide-react'
import { Hero } from '@/components/home/hero'
import { SectionHeading } from '@/components/section-heading'
import { ProductCard } from '@/components/product-card'
import { CommunityCard } from '@/components/community-card'
import { RouteCard } from '@/components/route-card'
import { PublicationCard } from '@/components/publication-card'
import { PhotoGallery } from '@/components/photo-gallery'
import { InteractiveMap } from '@/components/interactive-map'
import { WayuuDivider } from '@/components/wayuu-divider'
import { Button } from '@/components/ui/button'
import { getIndicadores } from '@/lib/api/indicadores'
import { getTopComunidades } from '@/lib/api/comunidades'
import { productos, rutas, publicaciones, galeria } from '@/lib/data'

const pilares = [
  { icon: ShoppingBag, title: 'Comercialización justa', desc: 'Nuevos canales para vender productos comunitarios de forma directa.' },
  { icon: Compass, title: 'Turismo comunitario', desc: 'Experiencias responsables lideradas por las propias comunidades.' },
  { icon: Leaf, title: 'Patrimonio y ambiente', desc: 'Difusión del patrimonio cultural, artesanal y ambiental Wayuu.' },
  { icon: Handshake, title: 'Redes de valor', desc: 'Fortalecimiento de vínculos entre comunidades, aliados y visitantes.' },
]

export default async function HomePage() {
  const indicadores = await getIndicadores()
  const topComunidades = await getTopComunidades()

  return (
    <>
      <Hero />

      {/* Indicators */}
      <section className="border-b border-border bg-card">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-y-8 px-4 py-10 sm:px-6 md:grid-cols-3 lg:grid-cols-6">
          {indicadores.map((ind) => (
            <div key={ind.label} className="text-center">
              <p className="font-serif text-3xl font-bold text-primary">
                {ind.valor}
                {ind.sufijo}
              </p>
              <p className="mt-1 text-xs text-muted-foreground text-balance">{ind.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* About / pilares */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <SectionHeading
          eyebrow="Sobre el proyecto"
          title="Una plataforma al servicio de las comunidades rurales"
          description="El proyecto IAP acompaña a las comunidades de La Guajira con un enfoque de Investigación Acción Participativa, poniendo la tecnología al servicio de su desarrollo."
        />
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {pilares.map((p) => (
            <div key={p.title} className="rounded-xl border border-border bg-card p-6 shadow-sm">
              <span className="flex size-11 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <p.icon className="size-5" />
              </span>
              <h3 className="mt-4 font-serif text-lg font-semibold">{p.title}</h3>
              <p className="mt-1.5 text-sm text-muted-foreground">{p.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <WayuuDivider />

      {/* Communities */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <SectionHeading
          eyebrow="Comunidades"
          title="Comunidades destacadas"
          description="Conoce a los pueblos que dan vida a este territorio."
          href="/comunidades"
        />
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {topComunidades.map((c) => (
            <CommunityCard
              key={c.id}
              comunidad={c}
              municipio={c.municipio}
            />
          ))}
        </div>
      </section>

      {/* Products */}
      <section className="bg-secondary/40">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
          <SectionHeading
            eyebrow="Marketplace"
            title="Productos destacados"
            description="Artesanías, gastronomía y productos del mar y la tierra guajira."
            href="/marketplace"
          />
          <div className="mt-10 grid grid-cols-2 gap-5 lg:grid-cols-4">
            {productos.slice(0, 4).map((p) => (
              <ProductCard key={p.id} producto={p} />
            ))}
          </div>
        </div>
      </section>

      {/* Tourism */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <SectionHeading
          eyebrow="Turismo"
          title="Rutas de turismo comunitario"
          description="Vive La Guajira con experiencias guiadas por sus habitantes."
          href="/turismo"
        />
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {rutas.map((r) => (
            <RouteCard key={r.id} ruta={r} />
          ))}
        </div>
      </section>

      {/* Map */}
      <section className="bg-secondary/40">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
          <SectionHeading
            eyebrow="Territorio"
            title="Explora el mapa de La Guajira"
            description="Comunidades, rutas, playas y sitios culturales en un solo lugar."
            href="/mapa"
            hrefLabel="Abrir mapa completo"
          />
          <div className="mt-10">
            <InteractiveMap />
          </div>
        </div>
      </section>

      {/* Publications */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <SectionHeading
          eyebrow="Comunidad activa"
          title="Publicaciones recientes"
          description="Historias y novedades compartidas por las comunidades."
          href="/publicaciones"
        />
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {publicaciones.map((p) => (
            <PublicationCard key={p.id} publicacion={p} />
          ))}
        </div>
      </section>

      {/* Gallery */}
      <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6">
        <SectionHeading eyebrow="Galería" title="La Guajira en imágenes" />
        <div className="mt-10">
          <PhotoGallery images={galeria} />
        </div>
      </section>

      {/* CTA */}
      <section className="relative isolate overflow-hidden bg-primary text-primary-foreground">
        <div className="wayuu-diamonds absolute inset-0 opacity-10" aria-hidden />
        <div className="relative mx-auto flex max-w-4xl flex-col items-center px-4 py-16 text-center sm:px-6">
          <h2 className="font-serif text-3xl font-bold text-balance sm:text-4xl">
            Sumate a fortalecer las comunidades de La Guajira
          </h2>
          <p className="mt-3 max-w-2xl text-pretty text-primary-foreground/85">
            Compra productos, reserva experiencias de turismo comunitario o conoce cómo apoyar el
            proyecto IAP como aliado.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button
              size="lg"
              variant="secondary"
              className="h-11 px-5 text-base"
              render={<Link href="/marketplace" />}
            >
              Ir al marketplace <ArrowRight className="size-4" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="h-11 border-white/40 bg-transparent px-5 text-base text-primary-foreground hover:bg-white/15 hover:text-primary-foreground"
              render={<Link href="/proyecto" />}
            >
              Conocer el proyecto
            </Button>
          </div>
        </div>
      </section>
    </>
  )
}
