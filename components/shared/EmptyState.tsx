import { EmptyDocuments } from '@/components/shared/illustrations/EmptyDocuments';

/**
 * Estado vacío estándar (plan de diseño §5.6): ilustración suave + copia
 * que invita a actuar (§7). Para vacíos de búsqueda/filtro pasar la
 * ilustración `EmptyResults` y un mensaje con el término buscado — es un
 * estado distinto del «sin datos» real.
 */
export function EmptyState({
  title,
  description,
  action,
  illustration,
}: {
  title: string;
  description?: string;
  action?: React.ReactNode;
  illustration?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-border bg-card px-6 py-14 text-center">
      {illustration ?? <EmptyDocuments />}
      <div className="flex flex-col gap-1">
        <p className="text-sm font-semibold text-foreground">{title}</p>
        {description && (
          <p className="mx-auto max-w-[38ch] text-sm text-muted-foreground">
            {description}
          </p>
        )}
      </div>
      {action}
    </div>
  );
}
