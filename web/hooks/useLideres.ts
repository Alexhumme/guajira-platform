'use client'

import { useEffect, useState } from 'react'
import type { Miembro } from '@/lib/data'
import { getLideres } from '@/lib/api/comunidades'

export function useLideres(comunidadId: string) {
  const [lideres, setLideres] = useState<Miembro[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let isMounted = true

    getLideres(comunidadId)
      .then((data) => {
        if (isMounted) setLideres(data)
      })
      .catch((err) => {
        if (isMounted) setError(err?.message ?? 'Error al cargar lideres')
      })
      .finally(() => {
        if (isMounted) setIsLoading(false)
      })

    return () => {
      isMounted = false
    }
  }, [])

  return { lideres, isLoading, error }
}
