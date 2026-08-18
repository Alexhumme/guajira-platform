import { PublicationCard } from "@/components/publications/publication-card";
import { Miembro, Comunidad, Publicacion } from "@/lib/data";


export function PublicationFeed({
  publicaciones,
}: {
  publicaciones: Publicacion[];
}) {
  if (publicaciones.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-border p-12 text-center text-muted-foreground">
        No se encontraron publicaciones.
      </div>
    );
  }

  return (
    <div className="mx-auto w-full space-y-6">
      {publicaciones.map((publicacion) => (
        <div
          key={publicacion.id}
          id={`publication-${publicacion.id}`}
        >
          <PublicationCard
            publicacion={publicacion}
          />
        </div>
      ))}
    </div>
  );
}