'use client'

import { useEffect, useState } from 'react'
import type { Producto } from '@/lib/data'
import { getProductos } from '@/lib/api/productos'

export function useProductos() {
  const [productos, setProductos] = useState<Producto[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let isMounted = true

    getProductos()
      .then((data) => {
        if (isMounted) setProductos(data)
      })
      .catch((err) => {
        if (isMounted) setError(err?.message ?? 'Error al cargar productos')
      })
      .finally(() => {
        if (isMounted) setIsLoading(false)
      })

    return () => {
      isMounted = false
    }
  }, [])

  return { productos, isLoading, error }
}
