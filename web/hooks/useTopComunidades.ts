'use client'

import { useEffect, useState } from 'react'
import { getTopComunidades, type ComunidadWithMunicipio } from '@/lib/api/comunidades'

export function useTopComunidades() {
  const [topComunidades, setTopComunidades] = useState<ComunidadWithMunicipio[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let isMounted = true
    setIsLoading(true)
    setError(null)

    getTopComunidades()
      .then((data) => { if (isMounted) setTopComunidades(data) })
      .catch((err) => { if (isMounted) setError(err?.message ?? 'Error al cargar comunidades') })
      .finally(() => { if (isMounted) setIsLoading(false) })

    return () => { isMounted = false }
  }, [])

  return { topComunidades, isLoading, error }
}
