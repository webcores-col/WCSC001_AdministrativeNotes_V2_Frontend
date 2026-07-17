import { CatalogManager } from "@/components/domain/catalogs/CatalogManager";
import { CatalogTabs } from "@/components/domain/catalogs/CatalogTabs";
import { identityTypeHooks } from "@/lib/query/catalogs";

export default function TiposIdentificacionPage() {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-semibold">Catálogos</h1>
      <CatalogTabs />
      <CatalogManager
        title="Tipos de identificación"
        hooks={identityTypeHooks}
      />
    </div>
  );
}
