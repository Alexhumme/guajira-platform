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
  const response = await fetch(url, { cache: 'force-cache' })

  if (!response.ok) {
    throw new Error(`Error fetching ${url}: ${response.status} ${response.statusText}`)
  }

  return response.json()
}

/**
 * Failsafe wrapper around fetchApi: on any network/server error it logs a
 * warning and returns the provided fallback instead of crashing the page.
 */
export async function safeFetchApi<T>(path: string, fallback: T): Promise<T> {
  try {
    return await fetchApi<T>(path)
  } catch (error) {
    console.warn(`[Comured] No se pudo obtener ${path}:`, error)
    return fallback
  }
}
