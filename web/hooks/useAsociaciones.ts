'use client'

import { useEffect, useState } from 'react'
import type { Asociacion } from '@/lib/data'
import { getAsociaciones } from '@/lib/api/asociaciones'

export function useAsociaciones() {
  const [asociaciones, setAsociaciones] = useState<Asociacion[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let isMounted = true
    setIsLoading(true)
    setError(null)

    getAsociaciones()
      .then((data) => { if (isMounted) setAsociaciones(data) })
      .catch((err) => { if (isMounted) setError(err?.message ?? 'Error al cargar asociaciones') })
      .finally(() => { if (isMounted) setIsLoading(false) })

    return () => { isMounted = false }
  }, [])

  return { asociaciones, isLoading, error }
}
