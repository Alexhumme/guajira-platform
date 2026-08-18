"use client";

import { useMemo, useState } from "react";
import { PublicationCard } from "@/components/publications/publication-card";
import { PublicationSearch } from "@/components/publications/publication-search";
import { PublicationSort } from "@/components/publications/publication-sort";
import { PublicationPreviews } from "@/components/publications/publication-previews";
import { PublicationFeed } from "@/components/publications/publication-feed";
import { Publicacion, Comunidad, Miembro } from "@/lib/data";

type SortMode = "recent" | "relevant";

export function PublicationsClient({
  publicaciones,
  comunidades,
  miembros,
}: {
  publicaciones: Publicacion[];
  comunidades: Comunidad[];
  miembros: Miembro[];
}) {
  const [search, setSearch] = useState("");
  const [selectedType, setSelectedType] = useState<
    "comunidad" | "miembro" | null
  >(null);

  const [selectedId, setSelectedId] = useState<string | null>(null);

  const [sortMode, setSortMode] = useState<SortMode>("recent");

  const publicacionesFiltradas = useMemo(() => {
    let resultado = [...publicaciones];

    /*
     * Filtro por comunidad
     */
    if (selectedType === "comunidad" && selectedId) {
      resultado = resultado.filter(
        (publicacion) =>
          publicacion.comunidadSlug === selectedId
      );
    }

    /*
     * Filtro por miembro
     */
    if (selectedType === "miembro" && selectedId) {
      resultado = resultado.filter(
        (publicacion) =>
          publicacion.autor === selectedId
      );
    }

    /*
     * Ordenamiento
     */
    resultado.sort((a, b) => {
      if (sortMode === "recent") {
        return (
          new Date(b.fecha).getTime() -
          new Date(a.fecha).getTime()
        );
      }

      /*
       * De momento podemos considerar "relevancia"
       * como una combinación sencilla de likes + antigüedad.
       *
       * Más adelante puedes reemplazar esto por un
       * algoritmo de relevancia real.
       */
      return b.likes - a.likes;
    });

    return resultado;
  }, [
    publicaciones,
    selectedType,
    selectedId,
    sortMode,
  ]);

  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6">

      {/* Barra superior */}
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

        <PublicationSearch
          search={search}
          setSearch={setSearch}
          comunidades={comunidades}
          miembros={miembros}
          selectedType={selectedType}
          selectedId={selectedId}
          onSelect={(type, id) => {
            setSelectedType(type);
            setSelectedId(id);
            setSearch("");
          }}
          onClear={() => {
            setSelectedType(null);
            setSelectedId(null);
            setSearch("");
          }}
        />

        <PublicationSort
          value={sortMode}
          onChange={setSortMode}
        />

      </div>

      {/* Feed + previews */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_260px]">

        <PublicationFeed
          publicaciones={publicacionesFiltradas}
        />

        <PublicationPreviews
          publicaciones={publicacionesFiltradas}
        />

      </div>

    </section>
  );
}