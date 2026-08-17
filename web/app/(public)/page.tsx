import Link from 'next/link'
import {
  ArrowDownRight,
  ArrowRight,
  Compass,
  Handshake,
  Leaf,
  ShoppingBag,
  Users,
} from 'lucide-react'

import { Hero } from '@/components/home/hero'
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
import { getProductos } from '@/lib/api/productos'
import { getPublicacionesRecientes } from '@/lib/api/publicaciones'
import { getRutas } from '@/lib/api/rutas'
import { galeria } from '@/lib/data'

const pilares = [
  {
    icon: ShoppingBag,
    number: '01',
    title: 'Producción',
    desc: 'Visibilizamos productos elaborados por las comunidades y fortalecemos sus posibilidades de comercialización.',
  },
  {
    icon: Users,
    number: '02',
    title: 'Organización comunitaria',
    desc: 'Las comunidades y sus organizaciones son protagonistas de los procesos desarrollados en el territorio.',
  },
  {
    icon: Leaf,
    number: '03',
    title: 'Saberes y territorio',
    desc: 'La tecnología se articula con conocimientos, prácticas culturales y recursos propios de La Guajira.',
  },
  {
    icon: Handshake,
    number: '04',
    title: 'Articulación',
    desc: 'Conectamos comunidades, instituciones, organizaciones y redes que contribuyen al desarrollo territorial.',
  },
]

export default async function HomePage() {
  const indicadores = await getIndicadores()
  const topComunidades = await getTopComunidades()
  const productos = await getProductos()
  const publicaciones = await getPublicacionesRecientes()
  const rutas = await getRutas()

  return (
    <>
      <Hero />

      {/* =========================================================
          INDICADORES
      ========================================================= */}

      <section className="border-y border-border bg-background">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="grid grid-cols-2 divide-x divide-border sm:grid-cols-3 lg:grid-cols-6">
            {indicadores.map((ind) => (
              <div
                key={ind.label}
                className="group px-4 py-8 text-center transition-colors hover:bg-secondary/30 sm:py-10"
              >
                <p className="font-serif text-3xl font-bold tracking-tight text-primary transition-transform duration-300 group-hover:-translate-y-1">
                  {ind.valor}
                  {ind.sufijo}
                </p>

                <p className="mx-auto mt-2 max-w-32 text-xs leading-relaxed text-muted-foreground">
                  {ind.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================
          INTRODUCCIÓN
      ========================================================= */}

      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:py-28">
        <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-primary">
              IAP · La Guajira
            </p>

            <h2 className="mt-4 max-w-xl font-serif text-4xl font-bold leading-[1.05] tracking-tight sm:text-5xl">
              Tecnología que nace desde el territorio.
            </h2>
          </div>

          <div className="max-w-2xl lg:pb-1">
            <p className="text-lg leading-relaxed text-muted-foreground">
              Esta plataforma reúne las experiencias, productos, comunidades y
              procesos desarrollados en el marco del proyecto de Investigación
              Acción Participativa en La Guajira.
            </p>

            <Link
              href="/proyecto"
              className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-primary transition-all hover:gap-3"
            >
              Conocer el proyecto
              <ArrowRight className="size-4" />
            </Link>
          </div>
        </div>
      </section>

      <WayuuDivider />

      {/* =========================================================
          PILARES — MOSAICO
      ========================================================= */}

      <section className="bg-secondary/30">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:py-24">
          <div className="mb-12 flex flex-col justify-between gap-5 md:flex-row md:items-end">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-primary">
                Nuestro enfoque
              </p>

              <h2 className="mt-3 font-serif text-3xl font-bold sm:text-4xl">
                Una plataforma construida alrededor del territorio
              </h2>
            </div>

            <p className="max-w-md text-sm leading-relaxed text-muted-foreground">
              La tecnología funciona como una herramienta para acompañar
              procesos que ya existen dentro de las comunidades.
            </p>
          </div>

          <div className="grid gap-px overflow-hidden rounded-2xl border border-border bg-border md:grid-cols-2">
            {pilares.map((p, index) => (
              <div
                key={p.title}
                className={`group relative min-h-64 bg-background p-7 transition-colors hover:bg-card sm:p-9 ${
                  index === 0 ? 'md:min-h-80' : ''
                }`}
              >
                <div className="flex items-start justify-between">
                  <span className="font-mono text-xs text-muted-foreground">
                    {p.number}
                  </span>

                  <p.icon className="size-6 text-primary transition-transform duration-500 group-hover:rotate-6 group-hover:scale-110" />
                </div>

                <div className="mt-16 max-w-md">
                  <h3 className="font-serif text-2xl font-bold">
                    {p.title}
                  </h3>

                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                    {p.desc}
                  </p>
                </div>

                <ArrowDownRight className="absolute bottom-7 right-7 size-5 text-muted-foreground opacity-0 transition-all duration-300 group-hover:translate-x-1 group-hover:translate-y-1 group-hover:opacity-100" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================
          COMUNIDADES — MOSAICO
      ========================================================= */}

      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:py-28">
        <div className="grid gap-10 lg:grid-cols-[0.7fr_1.3fr]">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-primary">
              Comunidades
            </p>

            <h2 className="mt-3 font-serif text-3xl font-bold sm:text-4xl">
              El territorio es el protagonista
            </h2>

            <p className="mt-5 max-w-md leading-relaxed text-muted-foreground">
              Conoce las comunidades que participan en los procesos de
              investigación, formación, producción y apropiación tecnológica.
            </p>

            <Button
              variant="outline"
              className="mt-7"
              render={<Link href="/comunidades" />}
            >
              Explorar comunidades
              <ArrowRight className="size-4" />
            </Button>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {topComunidades.slice(0, 2).map((c, index) => (
              <div
                key={c.id}
                className={
                  index === 0
                    ? 'sm:row-span-2'
                    : ''
                }
              >
                <CommunityCard
                  comunidad={c}
                  municipio={c.municipio}
                  totalProductos={
                    productos.filter(
                      (producto) => producto.comunidadId === c.id,
                    ).length
                  }
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      <WayuuDivider />

      {/* =========================================================
          MARKETPLACE
      ========================================================= */}

      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:py-28">
        <div className="grid gap-10 lg:grid-cols-[0.75fr_1.25fr]">
          <div className="flex flex-col justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-primary">
                Producción comunitaria
              </p>

              <h2 className="mt-3 font-serif text-3xl font-bold sm:text-4xl">
                Productos que cuentan una historia
              </h2>

              <p className="mt-5 max-w-md leading-relaxed text-muted-foreground">
                Artesanías, alimentos y otros productos elaborados por
                personas y organizaciones de las comunidades participantes.
              </p>
            </div>

            <Link
              href="/marketplace"
              className="mt-8 inline-flex w-fit items-center gap-2 text-sm font-semibold text-primary transition-all hover:gap-3"
            >
              Explorar marketplace
              <ArrowRight className="size-4" />
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-5 lg:grid-cols-4">
            {productos.slice(0, 4).map((p) => (
              <ProductCard key={p.id} producto={p} />
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================
          TURISMO — TODAVÍA NO IMPLEMENTADO
      ========================================================= */}

      {/*
      <section className="border-y border-border bg-secondary/30">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:py-28">
          <div className="grid gap-10 lg:grid-cols-[0.7fr_1.3fr]">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-primary">
                Turismo
              </p>

              <h2 className="mt-3 font-serif text-3xl font-bold sm:text-4xl">
                Conoce el territorio desde sus comunidades
              </h2>

              <p className="mt-5 text-muted-foreground">
                Experiencias y rutas construidas junto a sus habitantes.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              {rutas.map((r) => (
                <RouteCard key={r.id} ruta={r} />
              ))}
            </div>
          </div>
        </div>
      </section>
      */}

      {/* =========================================================
          MAPA — TODAVÍA NO IMPLEMENTADO
      ========================================================= */}

      {/*
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:py-28">
        <div className="mb-10">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-primary">
            Territorio
          </p>

          <h2 className="mt-3 font-serif text-3xl font-bold sm:text-4xl">
            Explora La Guajira
          </h2>

          <p className="mt-4 max-w-2xl text-muted-foreground">
            Comunidades, rutas, lugares y experiencias dentro de un mapa
            interactivo del territorio.
          </p>
        </div>

        <InteractiveMap />
      </section>
      */}

      {/* =========================================================
          PUBLICACIONES
      ========================================================= */}

      <section className="bg-secondary/30">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:py-28">
          <div className="mb-12 flex flex-col justify-between gap-5 md:flex-row md:items-end">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-primary">
                Desde las comunidades
              </p>

              <h2 className="mt-3 font-serif text-3xl font-bold sm:text-4xl">
                Lo que está pasando en el territorio
              </h2>
            </div>

            <Link
              href="/publicaciones"
              className="inline-flex items-center gap-2 text-sm font-semibold text-primary transition-all hover:gap-3"
            >
              Ver todas las publicaciones
              <ArrowRight className="size-4" />
            </Link>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {publicaciones.slice(0, 3).map((p) => (
              <PublicationCard key={p.id} publicacion={p} />
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================
          GALERÍA
      ========================================================= */}

      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:py-28">
        <div className="grid gap-10 lg:grid-cols-[0.65fr_1.35fr]">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-primary">
              Territorio en imágenes
            </p>

            <h2 className="mt-3 font-serif text-3xl font-bold sm:text-4xl">
              La Guajira desde sus protagonistas
            </h2>

            <p className="mt-5 max-w-md leading-relaxed text-muted-foreground">
              Una mirada a las personas, paisajes, actividades y procesos que
              hacen parte del proyecto.
            </p>
          </div>

          <PhotoGallery images={galeria} />
        </div>
      </section>

      {/* =========================================================
          CTA / PROYECTO
      ========================================================= */}

      <section className="relative isolate overflow-hidden border-t border-border bg-primary text-primary-foreground">
        <div
          className="wayuu-diamonds absolute inset-0 opacity-10"
          aria-hidden
        />

        <div className="relative mx-auto grid max-w-7xl gap-10 px-4 py-20 sm:px-6 lg:grid-cols-[1fr_auto] lg:items-end lg:py-24">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-primary-foreground/70">
              Investigación · Acción · Participación
            </p>

            <h2 className="mt-4 max-w-3xl font-serif text-4xl font-bold leading-tight sm:text-5xl">
              Conoce el proyecto que impulsa estos procesos.
            </h2>

            <p className="mt-5 max-w-2xl leading-relaxed text-primary-foreground/80">
              Descubre cómo el SENA, las comunidades y sus organizaciones
              trabajan conjuntamente para fortalecer capacidades y procesos
              productivos en el territorio.
            </p>
          </div>

          <Button
            size="lg"
            variant="secondary"
            className="h-12 px-6 text-base"
            render={<Link href="/proyecto" />}
          >
            Conocer el proyecto
            <ArrowRight className="size-4" />
          </Button>
        </div>
      </section>
    </>
  )
}