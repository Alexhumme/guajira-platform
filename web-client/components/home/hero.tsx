import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, MapPin } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function Hero() {
  return (
    <section className="relative isolate overflow-hidden">
      <Image
        src="/images/hero.png"
        alt="Paisaje de La Guajira al atardecer con una mujer Wayuu"
        fill
        priority
        sizes="100vw"
        className="object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/55 to-black/20" />
      <div className="relative mx-auto flex max-w-7xl flex-col px-4 py-24 sm:px-6 sm:py-32 lg:py-40">
        <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-primary/90 px-3 py-1 text-xs font-semibold text-primary-foreground">
          <MapPin className="size-3.5" /> Departamento de La Guajira · Colombia
        </span>
        <h1 className="mt-5 max-w-3xl font-serif text-4xl font-bold text-balance text-white sm:text-5xl lg:text-6xl">
          El tejido vivo de las comunidades Wayuu
        </h1>
        <p className="mt-5 max-w-xl text-lg leading-relaxed text-pretty text-white/85">
          Una plataforma para visibilizar iniciativas comunitarias, fortalecer procesos
          productivos y promover el turismo comunitario de La Guajira.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Button size="lg" className="h-11 px-5 text-base" render={<Link href="/marketplace" />}>
            Explorar el marketplace
            <ArrowRight className="size-4" />
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="h-11 border-white/40 bg-white/10 px-5 text-base text-white hover:bg-white/20 hover:text-white"
            render={<Link href="/turismo" />}
          >
            Descubrir rutas turísticas
          </Button>
        </div>
      </div>
    </section>
  )
}
