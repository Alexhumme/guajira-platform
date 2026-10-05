import type { Metadata } from 'next'
import { CommunitiesExplorer } from '@/components/communities/communities-explorer'

export const metadata: Metadata = {
  title: 'Comunidades | Comured',
  description: 'Conoce las comunidades Wayuu que hacen parte del proyecto Comured en La Guajira.',
}

export default function ComunidadesPage() {
  return <CommunitiesExplorer />
}
