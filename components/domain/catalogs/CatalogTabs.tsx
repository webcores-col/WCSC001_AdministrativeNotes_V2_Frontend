'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

const TABS = [
  { href: '/catalogos/tipos-identificacion', label: 'Tipos de identificación' },
  { href: '/catalogos/tipos-pagare', label: 'Tipos de pagaré' },
];

export function CatalogTabs() {
  const pathname = usePathname();

  return (
    <nav aria-label="Catálogos" className="flex gap-1 border-b">
      {TABS.map((tab) => {
        const isActive = pathname === tab.href;
        return (
          <Link
            key={tab.href}
            href={tab.href}
            aria-current={isActive ? 'page' : undefined}
            className={cn(
              'border-b-2 border-transparent px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground',
              isActive && 'border-primary text-foreground',
            )}
          >
            {tab.label}
          </Link>
        );
      })}
    </nav>
  );
}
