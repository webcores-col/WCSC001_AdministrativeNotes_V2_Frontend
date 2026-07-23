'use client';

import { Button } from '@/components/ui/button';

/**
 * Pie estándar del patrón de listado (plan §5.4). Mantiene la copia
 * «Página X de Y · N <unidad>» y los botones Anterior/Siguiente del
 * comportamiento original.
 */
export function TablePagination({
  page,
  totalPages,
  total,
  noun,
  onPrevious,
  onNext,
}: {
  page: number;
  totalPages: number;
  total: number;
  /** Sustantivo en plural para el contador (p. ej. «asociados»). */
  noun: string;
  onPrevious: () => void;
  onNext: () => void;
}) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border-subtle bg-surface-soft px-4 py-2.5 text-sm text-muted-foreground">
      <span className="tabular-nums">
        Página {page} de {totalPages} · {total} {noun}
      </span>
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          disabled={page <= 1}
          onClick={onPrevious}
        >
          Anterior
        </Button>
        <Button
          variant="outline"
          size="sm"
          disabled={page >= totalPages}
          onClick={onNext}
        >
          Siguiente
        </Button>
      </div>
    </div>
  );
}
