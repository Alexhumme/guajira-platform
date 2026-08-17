import type { Metadata } from 'next'
import { CommunitiesExplorer } from '@/components/communities-explorer'
import { getAsociaciones } from '@/lib/api/asociaciones'
import { getComunidades } from '@/lib/api/comunidades'
import { getMunicipios } from '@/lib/api/municipios'
import { getProductos } from '@/lib/api/productos'

export const metadata: Metadata = {
  title: 'Comunidades | IAP La Guajira',
  description: 'Conoce las comunidades Wayuu que hacen parte del proyecto IAP en La Guajira.',
}

export default async function ComunidadesPage() {
  const comunidades = await getComunidades()
  const municipios = await getMunicipios()
  const productos = await getProductos()
  const asociaciones = await getAsociaciones()

  return (
    <CommunitiesExplorer
      asociaciones={asociaciones}
      comunidades={comunidades}
      municipios={municipios}
      productos={productos}
    />
  )
}
