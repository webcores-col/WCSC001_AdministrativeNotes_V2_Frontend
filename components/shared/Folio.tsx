import { cn } from '@/lib/utils';

/**
 * Chip de folio — la firma del talonario (docs/PLAN_DISENO_UI.md §3): todo
 * identificador de pagaré se trata como folio de documento. Aparece en el
 * listado de Pagarés, en el encabezado del detalle y en los toasts.
 */
export function Folio({ id, className }: { id: number; className?: string }) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-sm border border-border-subtle bg-surface-soft px-2 py-0.5 font-mono text-xs font-medium tracking-[0.02em] tabular-nums',
        className,
      )}
    >
      Nº {id}
    </span>
  );
}
