import type { Comunidad, Municipio } from '@/lib/data'

const trimTrailingSlash = (value: string) => value.replace(/\/+$|\/+(?=\?)|\/+(?=#)/g, '')

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ? trimTrailingSlash(process.env.NEXT_PUBLIC_API_URL) : ''

export async function fetchApi<T>(path: string): Promise<T> {
  const url = `${API_BASE_URL}${path}`
  const response = await fetch(url, { cache: 'no-store' })

  if (!response.ok) {
    throw new Error(`Error fetching ${url}: ${response.status} ${response.statusText}`)
  }

  return response.json()
}

export async function getComunidades(): Promise<Comunidad[]> {
  return fetchApi<Comunidad[]>('/api/web-client/comunidades')
}

export async function getMunicipios(): Promise<Municipio[]> {
  return fetchApi<Municipio[]>('/api/web-client/municipios')
}
