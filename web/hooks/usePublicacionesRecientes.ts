'use client'

import { useEffect, useState } from 'react'
import type { Publicacion } from '@/lib/data'
import { getPublicacionesRecientes } from '@/lib/api/publicaciones'

export function usePublicacionesRecientes() {
  const [publicaciones, setPublicaciones] = useState<Publicacion[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let isMounted = true
    setIsLoading(true)
    setError(null)

    getPublicacionesRecientes()
      .then((data) => { if (isMounted) setPublicaciones(data) })
      .catch((err) => { if (isMounted) setError(err?.message ?? 'Error al cargar publicaciones') })
      .finally(() => { if (isMounted) setIsLoading(false) })

    return () => { isMounted = false }
  }, [])

  return { publicaciones, isLoading, error }
}
