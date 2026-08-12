import { WayuuDivider } from '@/components/wayuu-divider'
import Image from 'next/image'

export function PageHero({
  eyebrow,
  title,
  description,
  image,
}: {
  eyebrow?: string
  title: string
  description?: string
  image?: string
}) {
  return (
    <section className="relative overflow-hidden bg-sidebar text-sidebar-foreground">
      
      {/* Imagen de fondo */}
      {image && (
        <Image
          src={image}
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
      )}

      {/* Capa oscura para mejorar la legibilidad */}
      {image && (
          <div className="absolute inset-0 bg-gradient-to-r from-black/100 via-black/77 to-black/20" />
      )}

      {/* Contenido */}
      <div className="relative z-10 mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-16">
        {eyebrow && (
          <span className="text-xs font-semibold uppercase tracking-wider text-primary">
            {eyebrow}
          </span>
        )}

        <h1 className="mt-2 font-serif text-3xl font-bold text-balance sm:text-4xl lg:text-5xl">
          {title}
        </h1>

        {description && (
          <p className="mt-3 max-w-2xl text-pretty text-sidebar-foreground/75">
            {description}
          </p>
        )}
      </div>

      <div className="relative z-10">
        <WayuuDivider />
      </div>

    </section>
  )
}