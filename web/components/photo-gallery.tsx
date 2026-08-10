'use client'

import Image from 'next/image'
import { useState } from 'react'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'

export function PhotoGallery({
  images,
  className,
}: {
  images: string[]
  className?: string
}) {
  const [active, setActive] = useState<string | null>(null)

  return (
    <>
      <div className={cn('grid grid-cols-2 gap-3 md:grid-cols-4', className)}>
        {images.map((img, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setActive(img)}
            className={cn(
              'group relative aspect-square overflow-hidden rounded-lg bg-muted',
              i === 0 && 'col-span-2 row-span-2 aspect-auto md:aspect-square',
            )}
          >
            <Image
              src={img}
              alt=""
              fill
              sizes="(max-width: 768px) 50vw, 25vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </button>
        ))}
      </div>

      {active && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/85 p-4"
          onClick={() => setActive(null)}
          role="dialog"
          aria-modal="true"
        >
          <button
            type="button"
            aria-label="Cerrar"
            className="absolute right-4 top-4 flex size-10 items-center justify-center rounded-full bg-white/15 text-white hover:bg-white/25"
            onClick={() => setActive(null)}
          >
            <X className="size-5" />
          </button>
          <div className="relative h-[80vh] w-full max-w-4xl">
            <Image src={active} alt="" fill className="object-contain" />
          </div>
        </div>
      )}
    </>
  )
}
