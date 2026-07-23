import type { Municipio } from '@/lib/data'
import { getMunicipios as fetchMunicipios } from './client'

export async function getMunicipios(): Promise<Municipio[]> {
  return fetchMunicipios()
}
