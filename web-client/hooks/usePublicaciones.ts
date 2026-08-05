'use client'

import { useEffect, useState } from 'react'
import type { Publicacion } from '@/lib/data'
import { getPublicaciones, getPublicacionesByComunidad } from '@/lib/api/publicaciones'

export function usePublicaciones(comunidadId?: string) {
  const [publicaciones, setPublicaciones] = useState<Publicacion[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let isMounted = true

    const fetcher = comunidadId ? getPublicacionesByComunidad : getPublicaciones

    fetcher(comunidadId as any)
      .then((data) => {
        if (isMounted) setPublicaciones(data)
      })
      .catch((err) => {
        if (isMounted) setError(err?.message ?? 'Error al cargar publicaciones')
      })
      .finally(() => {
        if (isMounted) setIsLoading(false)
      })

    return () => {
      isMounted = false
    }
  }, [comunidadId])

  return { publicaciones, isLoading, error }
}
