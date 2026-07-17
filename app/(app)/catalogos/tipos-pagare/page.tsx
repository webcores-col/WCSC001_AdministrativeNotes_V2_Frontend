import { CatalogManager } from "@/components/domain/catalogs/CatalogManager";
import { CatalogTabs } from "@/components/domain/catalogs/CatalogTabs";
import { noteTypeHooks } from "@/lib/query/catalogs";

export default function TiposPagarePage() {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-semibold">Catálogos</h1>
      <CatalogTabs />
      <CatalogManager title="Tipos de pagaré" hooks={noteTypeHooks} />
    </div>
  );
}
