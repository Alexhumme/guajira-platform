'use client'

import Image from 'next/image'
import { ChevronDown, ExternalLink, Mail, Phone } from 'lucide-react'
import { useMemo, useState } from 'react'
import type { Asociacion, Comunidad, Municipio, Producto } from '@/lib/data'
import { CommunityCard } from '@/components/community-card'
import { PageHero } from './page-hero'

type CommunitiesExplorerProps = {
  asociaciones: Asociacion[]
  comunidades: Comunidad[]
  municipios: Municipio[]
  productos: Producto[]
}

function AssociationMark({ asociacion }: { asociacion: Asociacion }) {
  if (asociacion.logo) {
    return <Image src={asociacion.logo} alt={`Logo de ${asociacion.nombre}`} fill sizes="96px" className="object-contain" />
  }

  return <span aria-hidden>{(asociacion.acronimo || asociacion.nombre).slice(0, 2).toUpperCase()}</span>
}

export function CommunitiesExplorer({ asociaciones, comunidades, municipios, productos }: CommunitiesExplorerProps) {
  const [asociacionId, setAsociacionId] = useState<string | null>(null)
  const asociacionActiva = asociaciones.find((asociacion) => asociacion.id === asociacionId)
  const productosPorComunidad = useMemo(() => {
    return productos.reduce<Map<string, number>>((totales, producto) => {
      totales.set(producto.comunidadId, (totales.get(producto.comunidadId) ?? 0) + 1)
      return totales
    }, new Map())
  }, [productos])
  const comunidadesVisibles = asociacionActiva
    ? comunidades.filter((comunidad) => asociacionActiva.comunidadesIds.includes(comunidad.id))
    : comunidades

  return (
    <main className="communities-atlas">
      <PageHero
        eyebrow="Cartografía social"
        title="Comunidades que tejen territorio"
        description="Cada punto del mosaico es una comunidad con oficios, memorias y maneras propias de habitar La Guajira."
        image="images/mock-up/community-1.png"
      />
      <section className="communities-content">
        <aside className="association-menu !self-stretch" aria-label="Filtrar por asociación">
          <div className="sticky top-0">
            <div className="association-menu__heading">
              <p>Redes del territorio</p>
              <span>{asociaciones.length} asociaciones</span>
            </div>
            <div className="association-menu__options">
            <button
              type="button"
              className={!asociacionActiva ? 'association-menu__option is-active' : 'association-menu__option'}
              onClick={() => setAsociacionId(null)}
            >
              <span className="association-menu__glyph" aria-hidden>✦</span>
              Todas las comunidades
            </button>
            {asociaciones.map((asociacion) => (
              <button
                key={asociacion.id}
                type="button"
                className={asociacion.id === asociacionId ? 'association-menu__option is-active' : 'association-menu__option'}
                onClick={() => setAsociacionId(asociacion.id)}
              >
                <span className="association-menu__logo" aria-hidden>
                  <AssociationMark asociacion={asociacion} />
                </span>
                <span>
                  <strong>{asociacion.acronimo || asociacion.nombre}</strong>
                  {asociacion.acronimo ? <small>{asociacion.nombre}</small> : null}
                </span>
              </button>
            ))}
          </div>
          </div>
        </aside>

        <div className="communities-atlas__body">
          {asociacionActiva ? (
            <section className="association-profile" aria-labelledby="association-name">
              <div className="association-profile__identity">
                <div>
                  <p>{asociacionActiva.acronimo || 'Asociación comunitaria'}</p>
                  <h2 id="association-name" className='font-bold'>{asociacionActiva.nombre}</h2>
                </div>
              </div>
              <div className="association-profile__main">
                <p className="association-profile__description">
                  {asociacionActiva.descripcion || 'Organización que reúne y fortalece iniciativas comunitarias del territorio.'}
                </p>
                <div className="association-profile__contact">
                  {asociacionActiva.telefono ? <a href={`tel:${asociacionActiva.telefono}`}><Phone /> {asociacionActiva.telefono}</a> : null}
                  {asociacionActiva.correo ? <a href={`mailto:${asociacionActiva.correo}`}><Mail /> {asociacionActiva.correo}</a> : null}
                  {asociacionActiva.redes.map((red) => red.link ? (
                    <a key={`${red.red_social}-${red.link}`} href={red.link} target="_blank" rel="noreferrer">
                      <ExternalLink /> {red.usuario || red.red_social}
                    </a>
                  ) : null)}
                </div>
              </div>
              <div className="association-profile__details">
                <details>
                  <summary>Enlace institucional SENA <ChevronDown /></summary>
                  <div>
                    <strong>{asociacionActiva.representanteSena.nombre || 'Sin representante registrado'}</strong>
                    {asociacionActiva.representanteSena.telefono ? <span>{asociacionActiva.representanteSena.telefono}</span> : null}
                    {asociacionActiva.representanteSena.correo ? <span>{asociacionActiva.representanteSena.correo}</span> : null}
                  </div>
                </details>
                <details>
                  <summary>Representantes comunitarios ({asociacionActiva.representantes.length}) <ChevronDown /></summary>
                  <div className="association-profile__representatives">
                    {asociacionActiva.representantes.length ? asociacionActiva.representantes.map((representante) => (
                      <p key={representante.id}>
                        <strong>{representante.nombre}</strong>
                        <span>{representante.comunidad}</span>
                      </p>
                    )) : <span>Sin representantes registrados.</span>}
                  </div>
                </details>
              </div>
            </section>
          ) : (
            <div className="communities-atlas__all-heading">
              <p>Vista completa</p>
              <h2>Un mosaico de saberes y paisajes</h2>
            </div>
          )}

            <section className="community-groups__grid" aria-live="polite" aria-label="Comunidades visibles">
            {comunidadesVisibles.map((comunidad) => (
              <CommunityCard
                key={comunidad.id}
                comunidad={comunidad}
                municipio={municipios.find((municipio) => municipio.id === comunidad.municipioId)}
                totalProductos={productosPorComunidad.get(comunidad.id) ?? 0}
              />))}
              
            </section>
 
          {!comunidadesVisibles.length ? (
            <div className="communities-atlas__empty">
              Esta asociación aún no tiene comunidades visibles vinculadas.
            </div>
          ) : null}
        </div>
      </section>
    </main>
  )
}
