import { Select } from "@/components/ui/input";

export function PublicationSort({
  value,
  onChange,
}: {
  value: "recent" | "relevant";
  onChange: (value: "recent" | "relevant") => void;
}) {
  return (
    <div className="flex items-center gap-2 whitespace-nowrap">
      <span className="text-sm text-muted-foreground">
        Ordenar por
      </span>

      <Select
        value={value}
        onChange={(e) =>
          onChange(
            e.target.value as "recent" | "relevant"
          )
        }
      >
        <option value="recent">
          Más recientes
        </option>

        <option value="relevant">
          Más relevantes
        </option>
      </Select>
    </div>
  );
}