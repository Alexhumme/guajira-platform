"use client"

import Image from "next/image"
import Link from "next/link"
import { useMemo, useState } from "react"
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Users,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ProductCard } from "@/components/product-card"
import { PublicationCard } from "@/components/publication-card"
import { WayuuDivider } from "@/components/wayuu-divider"

import { cn } from "@/lib/utils"
import { getMunicipio, Miembro, type Comunidad } from "@/lib/data"

import { useProductos } from "@/hooks/useProductos"
import { usePublicaciones } from "@/hooks/usePublicaciones"
import { useLideres } from "@/hooks/useLideres"
//import { useAsociaciones } from "@/hooks/useAsociaciones"


// ============================================================
// TIPOS
// ============================================================

type CommunityDetailProps = {
  comunidad: Comunidad
  municipio?: {
    nombre: string
    departamento: string
  }
}

const tabs = ["Nosotros", "Productos", "Publicaciones"] as const

type Tab = (typeof tabs)[number]


// ============================================================
// COMPONENTE PRINCIPAL
// ============================================================

export function CommunityDetail({
  comunidad,
  municipio,
}: CommunityDetailProps) {
  const [tab, setTab] = useState<Tab>("Nosotros")

  const { productos } = useProductos()
  const { publicaciones } = usePublicaciones()

  const {
    lideres,
    isLoading: lideresLoading,
  } = useLideres(comunidad.id);

  const {
    asociaciones,
    isLoading: asociacionesLoading,
  } = {asociaciones:[],isLoading:false};//useAsociaciones(comunidad.id)

  const resolvedMunicipio =
    municipio ?? getMunicipio(comunidad.municipioId)

  const productosComunidad = useMemo(
    () =>
      productos.filter(
        (producto) => producto.comunidadId === comunidad.id
      ),
    [productos, comunidad.id]
  )

  const publicacionesComunidad = useMemo(
    () =>
      publicaciones.filter(
        (publicacion) => publicacion.comunidadNombre === comunidad.nombre
      ),
    [publicaciones, comunidad.nombre]
  )

  return (
    <>
      {/* ======================================================
          HERO
      ====================================================== */}

      <section className="relative h-[52vh] min-h-80 w-full overflow-hidden">
        <Image
          src={comunidad.portada || "/placeholder.svg"}
          alt={comunidad.nombre}
          fill
          priority
          className="object-cover"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-foreground/85 via-foreground/40 to-transparent" />

        <div className="absolute inset-x-0 bottom-0 mx-auto max-w-6xl px-4 pb-8">
          <div className="flex flex-wrap items-center gap-2 text-sm text-background/80">
            <MapPin className="size-4" />

            <span>
              {resolvedMunicipio?.nombre}
              {resolvedMunicipio?.departamento
                ? `, ${resolvedMunicipio.departamento}`
                : ""}
            </span>
          </div>

          <h1 className="mt-2 font-serif text-3xl font-bold text-background text-balance md:text-5xl">
            {comunidad.nombre}
          </h1>

          <p className="mt-3 max-w-2xl text-pretty text-background/90">
            {comunidad.descripcion}
          </p>

          <div className="mt-4 flex flex-wrap gap-3">
            <Badge variant="onDark">
              <Users className="size-3.5" />
              {comunidad.habitantes} habitantes
            </Badge>

            {comunidad.fundacion && (
              <Badge variant="onDark">
                <Calendar className="size-3.5" />
                Desde {comunidad.fundacion}
              </Badge>
            )}
          </div>
        </div>
      </section>


      {/* ======================================================
          NAVEGACIÓN DE LA COMUNIDAD
      ====================================================== */}

      <div className="sticky top-16 z-30 border-b border-border bg-background/95 backdrop-blur">
        <div className="mx-auto flex max-w-6xl gap-1 overflow-x-auto px-4">
          {tabs.map((tabName) => (
            <button
              key={tabName}
              type="button"
              onClick={() => setTab(tabName)}
              className={cn(
                "shrink-0 border-b-2 px-4 py-3 text-sm font-medium transition-colors",
                tab === tabName
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              )}
            >
              {tabName}
            </button>
          ))}
        </div>
      </div>


      {/* ======================================================
          CONTENIDO
      ====================================================== */}

      <section className="mx-auto max-w-6xl px-4 py-10 md:py-14">

        {/* ====================================================
            NOSOTROS
        ==================================================== */}

        {tab === "Nosotros" && (
          <CommunityAbout
            comunidad={comunidad}
            lideres={lideres}
            lideresLoading={lideresLoading}
            asociaciones={asociaciones}
            asociacionesLoading={asociacionesLoading}
          />
        )}


        {/* ====================================================
            PRODUCTOS
        ==================================================== */}

        {tab === "Productos" && (
          <section>
            <h2 className="font-serif text-2xl font-bold">
              Productos de la comunidad
            </h2>

            {productosComunidad.length > 0 ? (
              <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {productosComunidad.map((producto) => (
                  <ProductCard
                    key={producto.id}
                    producto={producto}
                  />
                ))}
              </div>
            ) : (
              <p className="mt-4 text-muted-foreground">
                Aún no hay productos registrados.
              </p>
            )}
          </section>
        )}


        {/* ====================================================
            PUBLICACIONES
        ==================================================== */}

        {tab === "Publicaciones" && (
          <section>
            <h2 className="font-serif text-2xl font-bold">
              Publicaciones
            </h2>

            {publicacionesComunidad.length > 0 ? (
              <div className="mt-6 grid gap-6 md:grid-cols-2">
                {publicacionesComunidad.map((publicacion) => (
                  <PublicationCard
                    key={publicacion.id}
                    publicacion={publicacion}
                  />
                ))}
              </div>
            ) : (
              <p className="mt-4 text-muted-foreground">
                Esta comunidad aún no ha publicado.
              </p>
            )}
          </section>
        )}
      </section>

      <WayuuDivider />
    </>
  )
}


// ============================================================
// NOSOTROS
// ============================================================

type CommunityAboutProps = {
  comunidad: Comunidad
  lideres: Miembro[]
  lideresLoading: boolean
  asociaciones: Asociacion[]
  asociacionesLoading: boolean
}

function CommunityAbout({
  comunidad,
  lideres,
  lideresLoading,
  asociaciones,
  asociacionesLoading,
}: CommunityAboutProps) {
  return (
    <div className="space-y-14">

      {/* ======================================================
          DESCRIPCIÓN + CONTACTO
      ====================================================== */}

      <div className="grid gap-10 lg:grid-cols-[1.5fr_1fr]">

        {/* Descripción */}

        <div>
          <h2 className="font-serif text-2xl font-bold">
            Sobre la comunidad
          </h2>

          <p className="mt-5 leading-relaxed text-pretty text-muted-foreground">
            {comunidad.descripcion}
          </p>
        </div>


        {/* Contacto */}

        <CommunityContact comunidad={comunidad} />
      </div>


      {/* ======================================================
          GALERÍA
      ====================================================== */}

      {comunidad.galeria.length > 0 && (
        <section>
          <h2 className="font-serif text-2xl font-bold">
            Galería
          </h2>

          <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-3">
            {comunidad.galeria.map((imagen, index) => (
              <div
                key={`${imagen}-${index}`}
                className="relative aspect-square overflow-hidden rounded-xl border border-border"
              >
                <Image
                  src={imagen || "/placeholder.svg"}
                  alt={`${comunidad.nombre} - imagen ${index + 1}`}
                  fill
                  className="object-cover transition-transform duration-300 hover:scale-105"
                />
              </div>
            ))}
          </div>
        </section>
      )}


      {/* ======================================================
          LÍDERES
      ====================================================== */}

      {(lideresLoading || lideres.length > 0) && (
        <section>
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-serif text-2xl font-bold">
                Líderes de la comunidad
              </h2>

              <p className="mt-1 text-sm text-muted-foreground">
                Personas que representan y acompañan a la comunidad.
              </p>
            </div>
          </div>

          {lideresLoading ? (
            <p className="mt-6 text-muted-foreground">
              Cargando líderes...
            </p>
          ) : (
            <LeaderCarousel lideres={lideres} />
          )}
        </section>
      )}


      {/* ======================================================
          ASOCIACIONES
      ====================================================== */}

      {(asociacionesLoading || asociaciones.length > 0) && (
        <section>
          <div>
            <h2 className="font-serif text-2xl font-bold">
              Asociaciones
            </h2>

            <p className="mt-1 text-sm text-muted-foreground">
              Organizaciones a las que pertenece esta comunidad.
            </p>
          </div>

          {asociacionesLoading ? (
            <p className="mt-6 text-muted-foreground">
              Cargando asociaciones...
            </p>
          ) : (
            <AssociationCarousel
              asociaciones={asociaciones}
            />
          )}
        </section>
      )}
    </div>
  )
}


// ============================================================
// CONTACTO
// ============================================================

function CommunityContact({
  comunidad,
}: {
  comunidad: Comunidad
}) {
  const contacto = comunidad.contacto

  const tieneContacto =
    contacto.telefono ||
    contacto.correo ||
    contacto.whatsapp ||
    comunidad.redes.length > 0

  if (!tieneContacto) {
    return null
  }

  return (
    <div>
      <h2 className="font-serif text-2xl font-bold">
        Contacto
      </h2>

      <div className="mt-5 space-y-3">

        {contacto.telefono && (
          <a
            href={`tel:${contacto.telefono}`}
            className="flex items-center gap-3 rounded-xl border border-border p-4 transition-colors hover:border-primary"
          >
            <Phone className="size-5 text-primary" />

            <span>
              {contacto.telefono}
            </span>
          </a>
        )}

        {contacto.correo && (
          <a
            href={`mailto:${contacto.correo}`}
            className="flex items-center gap-3 rounded-xl border border-border p-4 transition-colors hover:border-primary"
          >
            <Mail className="size-5 text-primary" />

            <span className="break-all">
              {contacto.correo}
            </span>
          </a>
        )}

        {contacto.whatsapp && (
          <a
            href={`https://wa.me/${contacto.whatsapp}`}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-3 rounded-xl border border-border p-4 transition-colors hover:border-primary"
          >
            <MessageCircle className="size-5 text-primary" />

            <span>
              WhatsApp
            </span>
          </a>
        )}

        {comunidad.redes.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-2">
            {comunidad.redes.map((red) => {
              const icon =
                red.red_social === "instagram"
                  ? "/icons/instagram.svg"
                  : red.red_social === "facebook"
                    ? "/icons/facebook.svg"
                    : "/icons/globe.svg"

              return (
                <Badge
                  key={`${red.red_social}-${red.usuario ?? "link"}`}
                  variant="outline"
                  className="py-2"
                >
                  <Image
                    alt={red.red_social}
                    width={20}
                    height={20}
                    src={icon}
                    className="mr-2"
                  />

                  {red.usuario || red.red_social}
                </Badge>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}


// ============================================================
// CARRUSEL DE LÍDERES
// ============================================================

function LeaderCarousel({
  lideres,
}: {
  lideres: Miembro[]
}) {
  const [index, setIndex] = useState(0)

  if (!lideres.length) {
    return null
  }

  const visibleCount = 3
  const maxIndex = Math.max(
    0,
    lideres.length - visibleCount
  )

  const previous = () => {
    setIndex((current) => Math.max(0, current - 1))
  }

  const next = () => {
    setIndex((current) =>
      Math.min(maxIndex, current + 1)
    )
  }

  return (
    <div className="relative mt-6">

      <div className="flex gap-4 overflow-hidden">
        {lideres.map((lider) => (
          <div
            key={lider.id}
            className="min-w-[220px] flex-1 rounded-xl border border-border bg-card p-4"
          >
            <div className="flex items-center gap-4">

              <div className="relative size-16 shrink-0 overflow-hidden rounded-full border border-border">
                <Image
                  src={lider.avatar || "/placeholder-user.jpg"}
                  alt={lider.nombre}
                  fill
                  className="object-cover"
                />
              </div>

              <div className="min-w-0">
                <p className="font-medium">
                  {lider.nombre}
                </p>

                {lider.rol && (
                  <p className="mt-1 text-sm text-muted-foreground">
                    {lider.rol}
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {lideres.length > visibleCount && (
        <CarouselControls
          onPrevious={previous}
          onNext={next}
          previousDisabled={index === 0}
          nextDisabled={index === maxIndex}
        />
      )}
    </div>
  )
}


// ============================================================
// CARRUSEL DE ASOCIACIONES
// ============================================================

function AssociationCarousel({
  asociaciones,
}: {
  asociaciones: Asociacion[]
}) {
  const [index, setIndex] = useState(0)

  if (!asociaciones.length) {
    return null
  }

  const visibleCount = 3

  const maxIndex = Math.max(
    0,
    asociaciones.length - visibleCount
  )

  const previous = () => {
    setIndex((current) => Math.max(0, current - 1))
  }

  const next = () => {
    setIndex((current) =>
      Math.min(maxIndex, current + 1)
    )
  }

  return (
    <div className="relative mt-6">

      <div className="flex gap-4 overflow-hidden">
        {asociaciones.map((asociacion) => (
          <div
            key={asociacion.id}
            className="min-w-[220px] flex-1 rounded-xl border border-border bg-card p-5"
          >
            <div className="flex items-center gap-4">

              <div className="relative size-16 shrink-0 overflow-hidden rounded-xl border border-border bg-background">
                <Image
                  src={
                    asociacion.logo ||
                    "/placeholder.svg"
                  }
                  alt={asociacion.nombre}
                  fill
                  className="object-contain p-2"
                />
              </div>

              <div className="min-w-0">
                <p className="font-medium text-pretty">
                  {asociacion.nombre}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {asociaciones.length > visibleCount && (
        <CarouselControls
          onPrevious={previous}
          onNext={next}
          previousDisabled={index === 0}
          nextDisabled={index === maxIndex}
        />
      )}
    </div>
  )
}


// ============================================================
// CONTROLES DEL CARRUSEL
// ============================================================

function CarouselControls({
  onPrevious,
  onNext,
  previousDisabled,
  nextDisabled,
}: {
  onPrevious: () => void
  onNext: () => void
  previousDisabled: boolean
  nextDisabled: boolean
}) {
  return (
    <div className="mt-4 flex justify-end gap-2">
      <Button
        type="button"
        variant="outline"
        size="icon"
        onClick={onPrevious}
        disabled={previousDisabled}
        aria-label="Anterior"
      >
        <ChevronLeft className="size-4" />
      </Button>

      <Button
        type="button"
        variant="outline"
        size="icon"
        onClick={onNext}
        disabled={nextDisabled}
        aria-label="Siguiente"
      >
        <ChevronRight className="size-4" />
      </Button>
    </div>
  )
}


// ============================================================
// TIPOS DE LÍDERES Y ASOCIACIONES
// ============================================================

export type Lider = {
  id: string
  nombres: string
  avatar?: string
  rol?: string
}

export type Asociacion = {
  id: string
  nombre: string
  logo?: string
}