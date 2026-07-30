'use client';

import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

/**
 * Pie estándar del patrón de listado (plan §5.4). Mantiene la copia
 * «Página X de Y · N <unidad>»; agrega saltos a primera/última página
 * (solo cuando hay más de 2 páginas) para navegar listados largos sin
 * pasar uno por uno.
 */
export function TablePagination({
  page,
  totalPages,
  total,
  noun,
  onPageChange,
}: {
  page: number;
  totalPages: number;
  total: number;
  /** Sustantivo en plural para el contador (p. ej. «asociados»). */
  noun: string;
  onPageChange: (page: number) => void;
}) {
  const isFirst = page <= 1;
  const isLast = page >= totalPages;

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border-subtle bg-surface-soft px-4 py-2.5 text-sm text-muted-foreground">
      <span className="tabular-nums">
        Página {page} de {totalPages} · {total} {noun}
      </span>
      <div className="flex items-center gap-1">
        {totalPages > 2 && (
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            disabled={isFirst}
            onClick={() => onPageChange(1)}
            aria-label="Primera página"
          >
            <ChevronsLeft aria-hidden="true" />
          </Button>
        )}
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={isFirst}
          onClick={() => onPageChange(page - 1)}
        >
          <ChevronLeft aria-hidden="true" />
          Anterior
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={isLast}
          onClick={() => onPageChange(page + 1)}
        >
          Siguiente
          <ChevronRight aria-hidden="true" />
        </Button>
        {totalPages > 2 && (
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            disabled={isLast}
            onClick={() => onPageChange(totalPages)}
            aria-label="Última página"
          >
            <ChevronsRight aria-hidden="true" />
          </Button>
        )}
      </div>
    </div>
  );
}
