import { cn } from '@/lib/utils';

/**
 * Header de página estándar (plan de diseño §5.3): título fluido +
 * descripción muted + slot de acciones a la derecha. Todos los módulos lo
 * usan — nunca un h1 ad-hoc por vista.
 */
export function PageHeader({
  title,
  description,
  actions,
  className,
}: {
  title: string;
  description?: string;
  actions?: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        'flex flex-wrap items-end justify-between gap-x-6 gap-y-3',
        className,
      )}
    >
      <div className="flex min-w-0 flex-col gap-0.5">
        <h1 className="text-[clamp(1.5rem,1.2rem+1.2vw,1.875rem)] font-semibold tracking-tight">
          {title}
        </h1>
        {description && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}
      </div>
      {actions && (
        <div className="flex flex-wrap items-center gap-3">{actions}</div>
      )}
    </div>
  );
}
