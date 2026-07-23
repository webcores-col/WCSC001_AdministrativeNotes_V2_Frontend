import { cn } from '@/lib/utils';

/**
 * Card contenedora del patrón de listado (plan de diseño §5.4): radius-xl,
 * borde sutil, overflow oculto. Es un `@container`: con `cards`, la tabla
 * solo se muestra cuando el contenedor supera `@3xl` (~768px) y por debajo
 * se renderiza la lista de cards apiladas — decide el ancho del contenedor,
 * no el viewport, así el mismo listado funciona en una columna angosta.
 */
export function TableCard({
  table,
  cards,
  footer,
  className,
}: {
  table: React.ReactNode;
  /** Lista de <li> para contenedores angostos. Sin ella, la tabla se muestra siempre (scroll propio). */
  cards?: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn('@container', className)}>
      <div className="flex flex-col overflow-hidden rounded-xl border border-border-subtle bg-card shadow-sm">
        <div className={cn(cards && 'hidden @3xl:block')}>{table}</div>
        {cards && (
          <ul className="flex flex-col divide-y divide-border-subtle @3xl:hidden">
            {cards}
          </ul>
        )}
        {footer}
      </div>
    </div>
  );
}
