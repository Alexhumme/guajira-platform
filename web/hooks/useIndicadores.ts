import { useEffect, useState } from 'react'
import type { Indicador } from '@/lib/data'
import { getIndicadores } from '@/lib/api/indicadores'

export function useIndicadores() {
  const [indicadores, setIndicadores] = useState<Indicador[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadIndicadores() {
      try {
        const data = await getIndicadores()
        setIndicadores(data)
      } catch (err) {
        setError((err as Error)?.message ?? 'Error al cargar indicadores')
      } finally {
        setLoading(false)
      }
    }

    loadIndicadores()
  }, [])

  return { indicadores, loading, error }
}
