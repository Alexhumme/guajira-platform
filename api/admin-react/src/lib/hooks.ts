import { useEffect, useState } from 'react'
import { readJson } from './api'
import type { SectionKey } from '../types'

export function useAuthState() {
  const [authState, setAuthState] = useState<'loading' | 'authenticated' | 'guest'>('loading')

  useEffect(() => {
    async function ensureSession() {
      try {
        const response = await fetch('/api/auth/me', { credentials: 'include' })
        setAuthState(response.ok ? 'authenticated' : 'guest')
      } catch {
        setAuthState('guest')
      }
    }

    void ensureSession()
  }, [])

  return [authState, setAuthState] as const
}

export function useSectionData(endpoint: string, sectionKey: SectionKey, authState: 'loading' | 'authenticated' | 'guest') {
  const [rowsBySection, setRowsBySection] = useState<Record<SectionKey, Record<string, unknown>[]>>({} as Record<SectionKey, Record<string, unknown>[]>)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (authState !== 'authenticated') return

    async function loadSection() {
      try {
        setLoading(true)
        const data = await readJson<Record<string, unknown>[]>(endpoint)
        setRowsBySection((current) => ({ ...current, [sectionKey]: Array.isArray(data) ? data : [] }))
      } catch (error) {
        console.error(error)
        setRowsBySection((current) => ({ ...current, [sectionKey]: [] }))
      } finally {
        setLoading(false)
      }
    }

    void loadSection()
  }, [endpoint, sectionKey, authState])

  return { rowsBySection, setRowsBySection, loading }
}
