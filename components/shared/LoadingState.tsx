import { Skeleton } from '@/components/ui/skeleton';

/**
 * Placeholder de carga para vistas de listado (tablas). Las Fases 5-9 lo
 * reutilizan en vez de reimplementar su propio esqueleto por módulo.
 */
export function LoadingState({ rows = 5 }: { rows?: number }) {
  return (
    <div className="flex flex-col gap-2" role="status" aria-label="Cargando">
      {Array.from({ length: rows }).map((_, index) => (
        <Skeleton key={index} className="h-10 w-full" />
      ))}
    </div>
  );
}
