import type { Comunidad, Municipio } from '@/lib/data'

const trimTrailingSlash = (value: string) => value.replace(/\/+$|\/+(?=\?)|\/+(?=#)/g, '')

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ? trimTrailingSlash(process.env.NEXT_PUBLIC_API_URL) : ''

export function resolveApiAssetUrl(path: string): string {
  if (!path || /^(?:[a-z][a-z\d+.-]*:)?\/\//i.test(path)) {
    return path
  }

  return API_BASE_URL ? `${API_BASE_URL}/${path.replace(/^\/+/, '')}` : path
}

export async function fetchApi<T>(path: string): Promise<T> {
  const url = `${API_BASE_URL}${path}`
  const response = await fetch(url, { cache: 'no-store' })

  if (!response.ok) {
    throw new Error(`Error fetching ${url}: ${response.status} ${response.statusText}`)
  }

  return response.json()
}

export async function getComunidades(): Promise<Comunidad[]> {
  const comunidades = await fetchApi<Comunidad[]>('/web-client/comunidades')
  const comunidadesWithImages = comunidades.map((comunidad) => ({
    ...comunidad,
    galeria: comunidad.galeria.map((imagen) => resolveApiAssetUrl(imagen))
  }))
  return comunidadesWithImages
}

export async function getMunicipios(): Promise<Municipio[]> {
  return fetchApi<Municipio[]>('/web-client/municipios')
}
