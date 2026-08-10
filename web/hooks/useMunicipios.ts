'use client'

import { useEffect, useState } from 'react'
import type { Municipio } from '@/lib/data'
import { getMunicipios } from '@/lib/api/municipios'

export function useMunicipios() {
  const [municipios, setMunicipios] = useState<Municipio[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let isMounted = true

    setIsLoading(true)
    setError(null)

    getMunicipios()
      .then((data) => {
        if (isMounted) {
          setMunicipios(data)
        }
      })
      .catch((err) => {
        if (isMounted) {
          setError(err?.message ?? 'Error fetching municipios')
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

  return { municipios, isLoading, error }
}
