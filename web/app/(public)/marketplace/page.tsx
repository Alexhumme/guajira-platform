import type { Metadata } from 'next'
import { PageHero } from '@/components/page-hero'
import { MarketplaceClient } from '@/components/marketplace-client'

export const metadata: Metadata = {
  title: 'Marketplace — IAP La Guajira',
  description: 'Catálogo de productos artesanales, gastronómicos y del mar de las comunidades de La Guajira.',
}

export default function MarketplacePage() {
  return (
    <>
      <PageHero
        eyebrow="Marketplace"
        title="Productos de las comunidades"
        description="Explora y filtra artesanías, gastronomía, pesca y más. Contacta directamente a los productores."
      />
      <MarketplaceClient />
    </>
  )
}
