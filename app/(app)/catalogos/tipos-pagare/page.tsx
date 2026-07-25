import { CatalogManager } from '@/components/domain/catalogs/CatalogManager';
import { CatalogTabs } from '@/components/domain/catalogs/CatalogTabs';
import { PageHeader } from '@/components/shared/PageHeader';
import { noteTypeHooks } from '@/lib/query/catalogs';

export default function TiposPagarePage() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Catálogos"
        description="Valores de referencia que usan asociados y pagarés."
      />
      <CatalogTabs />
      <CatalogManager title="Tipos de pagaré" hooks={noteTypeHooks} />
    </div>
  );
}
