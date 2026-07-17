import { notFound } from "next/navigation"
import { comunidades, getComunidadBySlug } from "@/lib/data"
import { CommunityDetail } from "@/components/community-detail"

export function generateStaticParams() {
  return comunidades.map((c) => ({ slug: c.slug }))
}

export default async function ComunidadPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const comunidad = getComunidadBySlug(slug)
  if (!comunidad) notFound()
  return <CommunityDetail comunidad={comunidad} />
}
