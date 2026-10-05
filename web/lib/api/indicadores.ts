import type { Indicador } from '@/lib/data'
import { safeFetchApi } from './client'

export async function getIndicadores(): Promise<Indicador[]> {
  return safeFetchApi<Indicador[]>('/web-client/indicadores', [])
}
