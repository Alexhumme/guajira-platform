import { ComunidadPageClient } from '@/components/communities/comunidad-page-client'

// No API dependency at build time: one static page is generated and the real
// slug is resolved entirely on the client. The hosting server must rewrite
// /comunidades/<slug> to this page (see public/.htaccess).
export async function generateStaticParams() {
  return [{ slug: 'index' }]
}

export default function ComunidadPage() {
  return <ComunidadPageClient />
}
