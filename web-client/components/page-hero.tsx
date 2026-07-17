import { WayuuDivider } from '@/components/wayuu-divider'

export function PageHero({
  eyebrow,
  title,
  description,
}: {
  eyebrow?: string
  title: string
  description?: string
}) {
  return (
    <section className="bg-sidebar text-sidebar-foreground">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-16">
        {eyebrow && (
          <span className="text-xs font-semibold uppercase tracking-wider text-primary">
            {eyebrow}
          </span>
        )}
        <h1 className="mt-2 font-serif text-3xl font-bold text-balance sm:text-4xl lg:text-5xl">
          {title}
        </h1>
        {description && (
          <p className="mt-3 max-w-2xl text-pretty text-sidebar-foreground/75">{description}</p>
        )}
      </div>
      <WayuuDivider />
    </section>
  )
}
