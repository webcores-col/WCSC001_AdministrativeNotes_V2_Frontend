'use client';

import { usePathname } from 'next/navigation';
import { MENU_ITEMS } from '@/lib/menu/menu-definition';

/** Título corto de la vista actual en el topbar (plan §5.1). */
export function HeaderTitle() {
  const pathname = usePathname();
  const label = pathname.startsWith('/perfil')
    ? 'Mi perfil'
    : MENU_ITEMS.find((item) => pathname.startsWith(item.href))?.label;

  return (
    <span className="text-sm font-semibold">
      {label ?? 'COINTRAMIN'}
    </span>
  );
}
