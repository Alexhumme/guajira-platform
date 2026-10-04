import type { Municipio } from '@/lib/data'
import { fetchApi } from './client'

export async function getMunicipios(): Promise<Municipio[]> {
  return fetchApi<Municipio[]>('/web-client/municipios')
}
