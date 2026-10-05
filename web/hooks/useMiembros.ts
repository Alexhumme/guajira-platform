'use client'

import { useEffect, useState } from 'react'
import type { Miembro } from '@/lib/data'
import { getMiembros } from '@/lib/api/miembros'

export function useMiembros() {
  const [miembros, setMiembros] = useState<Miembro[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let isMounted = true
    setIsLoading(true)
    setError(null)

    getMiembros()
      .then((data) => { if (isMounted) setMiembros(data) })
      .catch((err) => { if (isMounted) setError(err?.message ?? 'Error al cargar miembros') })
      .finally(() => { if (isMounted) setIsLoading(false) })

    return () => { isMounted = false }
  }, [])

  return { miembros, isLoading, error }
}
