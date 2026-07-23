import type { Indicador } from '@/lib/data'
import { fetchApi } from './client'

export async function getIndicadores(): Promise<Indicador[]> {
  return fetchApi<Indicador[]>('/api/web-client/indicadores')
}
