import type { Municipio } from '@/lib/data'
import { safeFetchApi } from './client'

export async function getMunicipios(): Promise<Municipio[]> {
  return safeFetchApi<Municipio[]>('/web-client/municipios', [])
}
