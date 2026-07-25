import { cn } from '@/lib/utils';

/**
 * Pie de acciones estándar de formularios (plan de diseño §5.5): botones a
 * la derecha en escritorio, apilados a ancho completo en móvil (el primario
 * queda arriba gracias a flex-col-reverse). Dentro de un grid de 2 columnas
 * ocupa el ancho completo.
 */
export function FormActions({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        'flex flex-col-reverse gap-3 border-t border-border-subtle pt-4 sm:col-span-2 sm:flex-row sm:justify-end [&>*]:w-full sm:[&>*]:w-auto',
        className,
      )}
    >
      {children}
    </div>
  );
}
