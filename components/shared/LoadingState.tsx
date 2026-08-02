import { Skeleton } from '@/components/ui/skeleton';

/**
 * Placeholders de carga con la silueta real del patrón que reemplazan
 * (plan §5.6) — misma altura que el contenido real para que no haya saltos
 * de layout al resolver (CLS ≈ 0):
 * - `table` (default): header + filas h-14 con avatar, dos líneas y badge.
 * - `detail`: pares label/valor de una vista de detalle o formulario.
 */
export function LoadingState({
  rows = 5,
  variant = 'table',
}: {
  rows?: number;
  variant?: 'table' | 'detail';
}) {
  if (variant === 'detail') {
    return (
      <div
        role="status"
        aria-label="Cargando"
        className="grid max-w-md grid-cols-2 gap-x-4 gap-y-4"
      >
        {Array.from({ length: rows }).map((_, index) => (
          <div key={index} className="contents">
            <Skeleton className="h-4 w-28 self-center" />
            <Skeleton className="h-4 w-40 self-center" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div
      role="status"
      aria-label="Cargando"
      className="overflow-hidden rounded-xl border border-border-subtle bg-card"
    >
      <div className="flex h-11 items-center gap-6 border-b border-border-subtle bg-surface-soft px-5">
        <Skeleton className="h-3 w-24" />
        <Skeleton className="h-3 w-32 max-sm:hidden" />
        <Skeleton className="ml-auto h-3 w-16" />
      </div>
      {Array.from({ length: rows }).map((_, index) => (
        <div
          key={index}
          className="flex h-14 items-center gap-3 border-b border-border-subtle px-5 last:border-b-0"
        >
          <Skeleton className="size-8 rounded-full" />
          <div className="flex flex-col gap-1.5">
            <Skeleton className="h-3 w-40 max-sm:w-28" />
            <Skeleton className="h-2.5 w-24" />
          </div>
          <Skeleton className="ml-auto h-5 w-16 rounded-full" />
        </div>
      ))}
    </div>
  );
}
