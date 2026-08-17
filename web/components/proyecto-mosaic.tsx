import Image from "next/image"
import { cn } from "@/lib/utils"

type MosaicProps = {
  children: React.ReactNode
  className?: string
}

export function ProyectoMosaic({
  children,
  className,
}: MosaicProps) {
  return (
    <div
      className={cn(
        "grid gap-3 sm:gap-4 lg:grid-cols-4",
        className
      )}
    >
      {children}
    </div>
  )
}


type ImageProps = {
  src: string
  alt: string
  className?: string
}

export function ProyectoImage({
  src,
  alt,
  className,
}: ImageProps) {
  return (
    <div
      className={cn(
        "group relative overflow-hidden bg-muted",
        className
      )}
    >
      <Image
        src={src}
        alt={alt}
        fill
        className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
      />

      <div className="absolute inset-0 bg-black/0 transition-colors duration-500 group-hover:bg-black/10" />
    </div>
  )
}


type NumberProps = {
  number: string
  title: string
  text: string
}

export function ProyectoNumber({
  number,
  title,
  text,
}: NumberProps) {
  return (
    <article className="flex min-h-[280px] flex-col justify-between border border-border p-7 sm:p-9">

      <span className="text-xs font-semibold tracking-[0.2em] text-primary">
        {number}
      </span>

      <div>

        <h3 className="font-serif text-2xl">
          {title}
        </h3>

        <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
          {text}
        </p>

      </div>

    </article>
  )
}


export function ProyectoQuote({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <blockquote className="border-l-2 border-primary pl-6 font-serif text-2xl leading-relaxed">
      {children}
    </blockquote>
  )
}