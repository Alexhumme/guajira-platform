"use client";

import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Miembro, Comunidad } from "@/lib/data";


export function PublicationSearch({
  search,
  setSearch,
  comunidades,
  miembros,
  selectedType,
  selectedId,
  onSelect,
  onClear,
}: {
  search: string;
  setSearch: (value: string) => void;

  comunidades: Comunidad[];
  miembros: Miembro[];

  selectedType: "comunidad" | "miembro" | null;
  selectedId: string | null;

  onSelect: (
    type: "comunidad" | "miembro",
    id: string
  ) => void;

  onClear: () => void;
}) {
  const query = search.toLowerCase().trim();

  const comunidadesFiltradas = comunidades
    .filter((comunidad) =>
      comunidad.nombre.toLowerCase().includes(query)
    )
    .slice(0, 5);

  const miembrosFiltrados = miembros
    .filter((miembro) =>
      miembro.nombre.toLowerCase().includes(query)
    )
    .slice(0, 5);

  const hayResultados =
    query &&
    (comunidadesFiltradas.length > 0 ||
      miembrosFiltrados.length > 0);

  const seleccionado =
    selectedType && selectedId;

  return (
    <div className="relative w-full max-w-xl">

      <div className="relative">

        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar comunidad o miembro..."
          className="pl-9 pr-10"
        />

        {seleccionado && (
          <button
            type="button"
            onClick={onClear}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            <X className="size-4" />
          </button>
        )}

      </div>

      {hayResultados && (
        <div className="absolute z-50 mt-2 w-full overflow-hidden rounded-xl border border-border bg-card shadow-lg">

          {comunidadesFiltradas.length > 0 && (
            <div className="p-2">

              <p className="px-3 py-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Comunidades
              </p>

              {comunidadesFiltradas.map((comunidad) => (
                <button
                  key={comunidad.id}
                  type="button"
                  onClick={() =>
                    onSelect(
                      "comunidad",
                      comunidad.slug
                    )
                  }
                  className="flex w-full items-center rounded-lg px-3 py-2 text-left text-sm hover:bg-muted"
                >
                  {comunidad.nombre}
                </button>
              ))}

            </div>
          )}

          {miembrosFiltrados.length > 0 && (
            <div className="border-t border-border p-2">

              <p className="px-3 py-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Miembros
              </p>

              {miembrosFiltrados.map((miembro) => (
                <button
                  key={miembro.id}
                  type="button"
                  onClick={() =>
                    onSelect(
                      "miembro",
                      miembro.id
                    )
                  }
                  className="flex w-full items-center rounded-lg px-3 py-2 text-left text-sm hover:bg-muted"
                >
                  {miembro.nombre}
                </button>
              ))}

            </div>
          )}

        </div>
      )}

    </div>
  );
}