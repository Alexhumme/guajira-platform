'use client'

import { useEffect, useState } from 'react'
import type { Comunidad } from '@/lib/data'
import { getComunidades } from '@/lib/api/comunidades'

export function useComunidades() {
  const [comunidades, setComunidades] = useState<Comunidad[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let isMounted = true

    setIsLoading(true)
    setError(null)

    getComunidades()
      .then((data) => {
        if (isMounted) {
          setComunidades(data)
        }
      })
      .catch((err) => {
        if (isMounted) {
          setError(err?.message ?? 'Error fetching comunidades')
        }
      })
      .finally(() => {
        if (isMounted) {
          setIsLoading(false)
        }
      })

    return () => {
      isMounted = false
    }
  }, [])

  return { comunidades, isLoading, error }
}
