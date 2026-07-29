'use client'

import { useEffect, useState } from 'react'
import type { RutaTuristica } from '@/lib/data'
import { getRutas } from '@/lib/api/rutas'

export function useRutas() {
  const [rutas, setRutas] = useState<RutaTuristica[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let isMounted = true

    setIsLoading(true)
    setError(null)

    getRutas()
      .then((data) => {
        if (isMounted) setRutas(data)
      })
      .catch((err) => {
        if (isMounted) setError(err?.message ?? 'Error al cargar rutas')
      })
      .finally(() => {
        if (isMounted) setIsLoading(false)
      })

    return () => {
      isMounted = false
    }
  }, [])

  return { rutas, isLoading, error }
}
