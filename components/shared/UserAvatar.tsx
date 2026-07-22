import { cn } from '@/lib/utils';

/**
 * Avatar de iniciales sobre tinte primario — el sistema no maneja fotos de
 * usuario. Decorativo (`aria-hidden`): el nombre siempre va en texto al lado.
 */
export function UserAvatar({
  name,
  className,
}: {
  name: string;
  className?: string;
}) {
  const initials =
    name
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((word) => word[0]?.toUpperCase() ?? '')
      .join('') || '?';

  return (
    <span
      aria-hidden="true"
      className={cn(
        'flex size-8 shrink-0 items-center justify-center rounded-full bg-primary-soft text-xs font-bold text-primary-soft-foreground',
        className,
      )}
    >
      {initials}
    </span>
  );
}
