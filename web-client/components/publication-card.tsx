'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useMemo, useState } from 'react'
import { ChevronLeft, ChevronRight, Clipboard, Heart, Mail, Share2, X } from 'lucide-react'
import { type Publicacion } from '@/lib/data'
import { cn } from '@/lib/utils'

const isVideoMedia = (src: string) => /\.(mp4|webm|mov|ogg)$/i.test(src)

export function PublicationCard({ publicacion }: { publicacion: Publicacion }) {
  const [liked, setLiked] = useState(false)
  const [activeIndex, setActiveIndex] = useState(0)
  const [showLightbox, setShowLightbox] = useState(false)
  const [showShare, setShowShare] = useState(false)
  const [copied, setCopied] = useState(false)
  const likes = publicacion.likes + (liked ? 1 : 0)
  const fecha = new Date(publicacion.fecha).toLocaleDateString('es-CO', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
  
  const comunidad = {slug: publicacion.comunidadSlug, nombre: publicacion.comunidadNombre};
  const media = publicacion.imagenes
  const activeMedia = media[activeIndex]
  const shareUrl = typeof window !== 'undefined' ? window.location.href : ''
  const description = `${publicacion.autor}${comunidad ? ` · ${comunidad.nombre}` : ''}`

  const hasMultipleMedia = media.length > 1
  const prevIndex = () => setActiveIndex((index) => (index - 1 + media.length) % media.length)
  const nextIndex = () => setActiveIndex((index) => (index + 1) % media.length)

  const handleCopy = async () => {
    if (!navigator.clipboard) return
    await navigator.clipboard.writeText(shareUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const activeMediaElement = useMemo(() => {
    if (!activeMedia) return null
    return isVideoMedia(activeMedia) ? (
      <video
        src={activeMedia}
        controls
        className="h-full w-full object-cover"
        preload="metadata"
      />
    ) : (
      <Image src={activeMedia} alt={publicacion.contenido || 'Post media'} fill className="object-cover" />
    )
  }, [activeMedia, publicacion.contenido])

  return (
    <article className="flex h-full flex-col overflow-hidden rounded-xl border border-border bg-card shadow-sm">
      <div className="flex-1">
        <div className="flex items-center gap-3 p-4">
          <span className="relative size-10 overflow-hidden rounded-full bg-muted">
            <Image src={publicacion.avatar} alt={publicacion.autor} fill className="object-cover" />
          </span>
          <div className="min-w-0">
            <p className="truncate font-medium">{publicacion.autor}</p>
            <p className="text-xs text-muted-foreground">
              {comunidad && (
                <Link href={`/comunidades/${comunidad.slug}`} className="hover:text-primary">
                  {comunidad.nombre}
                </Link>
              )}{' '}
              · {fecha}
            </p>
          </div>
        </div>

        <div
          className={cn(
            'px-4 pb-3',
            media.length === 0 && 'flex min-h-[14rem] flex-col items-center justify-center text-center',
          )}
        >
          <p className="text-sm leading-relaxed text-pretty">{publicacion.contenido}</p>
        </div>

        {media.length > 0 && (
          <div className="space-y-3 px-4 pb-3">
            <div
              className={cn(
                'group relative w-full overflow-hidden rounded-3xl border border-border bg-muted text-white',
                hasMultipleMedia ? 'aspect-square' : 'aspect-[4/3]',
              )}
            >
              {hasMultipleMedia && (
                <button
                  type="button"
                  onClick={(event) => {
                    event.stopPropagation()
                    prevIndex()
                  }}
                  className="absolute left-0 top-0 bottom-0 z-10 flex w-1/4 items-center justify-start px-3 text-white/80 transition hover:text-white"
                  aria-label="Anterior"
                >
                  <ChevronLeft className="size-6" />
                </button>
              )}
              {hasMultipleMedia && (
                <button
                  type="button"
                  onClick={(event) => {
                    event.stopPropagation()
                    nextIndex()
                  }}
                  className="absolute right-0 top-0 bottom-0 z-10 flex w-1/4 items-center justify-end px-3 text-white/80 transition hover:text-white"
                  aria-label="Siguiente"
                >
                  <ChevronRight className="size-6" />
                </button>
              )}
              <button
                type="button"
                onClick={() => setShowLightbox(true)}
                className="relative flex h-full w-full items-center justify-center bg-black/5"
              >
                <div className="absolute inset-0 overflow-hidden">
                  {activeMediaElement}
                </div>
                <span className="absolute inset-0" aria-hidden="true" />
              </button>
            </div>

            {media.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-2 pr-1">
              {media.map((item, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => setActiveIndex(index)}
                  className={cn(
                    'relative flex h-20 min-w-[5.5rem] overflow-hidden rounded-2xl border transition-all',
                    activeIndex === index
                      ? 'border-primary shadow-md'
                      : 'border-border hover:border-primary',
                  )}
                >
                  {isVideoMedia(item) ? (
                    <video src={item} className="h-full w-full object-cover" muted />
                  ) : (
                    <Image src={item} alt="Vista previa" fill className="object-cover" />
                  )}
                  {isVideoMedia(item) && (
                    <span className="pointer-events-none absolute right-2 top-2 rounded-full bg-black/60 px-2 py-1 text-[11px] uppercase tracking-[0.2em] text-white">
                      video
                    </span>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      </div>
      <div className="flex items-center gap-5 border-t border-border p-4 text-sm text-muted-foreground">
        <button
          type="button"
          onClick={() => setLiked((v) => !v)}
          className={cn('flex items-center gap-1.5 transition-colors hover:text-primary', liked && 'text-primary')}
        >
          <Heart className={cn('size-4', liked && 'fill-current')} /> {likes}
        </button>

        <button
          type="button"
          onClick={() => setShowShare(true)}
          className="ml-auto flex items-center gap-1.5 transition-colors hover:text-primary"
        >
          <Share2 className="size-4" /> Compartir
        </button>
      </div>

      {showLightbox && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/85 px-4 py-6"
          role="dialog"
          aria-modal="true"
        >
          <button
            type="button"
            onClick={() => setShowLightbox(false)}
            className="absolute right-4 top-4 z-20 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
            aria-label="Cerrar vista ampliada"
          >
            <X className="size-5" />
          </button>
          <div className="relative h-full w-full max-w-5xl overflow-hidden rounded-3xl border border-white/10 bg-black">
            {isVideoMedia(activeMedia) ? (
              <video
                src={activeMedia}
                controls
                autoPlay
                className="h-full w-full bg-black object-contain"
              />
            ) : (
              <Image src={activeMedia} alt={publicacion.contenido || 'Post media'} fill className="object-contain" />
            )}
          </div>
        </div>
      )}

      {showShare && (
        <div className="fixed inset-0 z-[90] flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-md overflow-hidden rounded-3xl border border-border bg-background shadow-xl">
            <div className="flex items-center justify-between border-b border-border px-5 py-4">
              <div>
                <p className="font-semibold">Compartir publicación</p>
                <p className="text-xs text-muted-foreground">Elige cómo compartir este post.</p>
              </div>
              <button
                type="button"
                onClick={() => setShowShare(false)}
                className="rounded-full p-2 text-muted-foreground transition hover:bg-muted hover:text-foreground"
              >
                <X className="size-5" />
              </button>
            </div>
            <div className="space-y-3 px-5 py-4">
              <a
                href={`https://api.whatsapp.com/send?text=${encodeURIComponent(`${description}\n${shareUrl}`)}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-3 rounded-2xl border border-border bg-muted px-4 py-3 text-sm transition hover:border-primary hover:text-primary"
              >
                <Share2 className="size-5" /> WhatsApp
              </a>
              <a
                href={`mailto:?subject=${encodeURIComponent(description)}&body=${encodeURIComponent(`${publicacion.contenido}\n\n${shareUrl}`)}`}
                className="flex items-center gap-3 rounded-2xl border border-border bg-muted px-4 py-3 text-sm transition hover:border-primary hover:text-primary"
              >
                <Mail className="size-5" /> Email
              </a>
              <button
                type="button"
                onClick={handleCopy}
                className="flex w-full items-center gap-3 rounded-2xl border border-border bg-muted px-4 py-3 text-left text-sm transition hover:border-primary hover:text-primary"
              >
                <Clipboard className="size-5" />
                <span>{copied ? 'Enlace copiado' : 'Copiar enlace'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </article>
  )
}
