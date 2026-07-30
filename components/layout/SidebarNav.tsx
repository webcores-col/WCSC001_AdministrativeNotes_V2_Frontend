'use client';

import { LogOut, UserRound } from 'lucide-react';
import { signOut } from 'next-auth/react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { MENU_SECTIONS } from '@/lib/menu/menu-definition';
import { hasPermission } from '@/lib/permissions/has-permission';
import { cn } from '@/lib/utils';

/**
 * Contenido del sidebar (marca + navegación + pie), compartido entre el
 * sidebar de escritorio y el drawer móvil (plan §5.1). Con `collapsible`,
 * entre `md` y `lg` solo se ven los iconos (rail) y el label viaja en un
 * tooltip; el tooltip se oculta en `lg+`, donde el label vuelve a ser texto.
 */

const itemClass = (active: boolean, collapsible: boolean) =>
  cn(
    'relative flex items-center gap-2.5 rounded-[10px] px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-surface-soft hover:text-foreground',
    active &&
      'bg-sidebar-accent font-semibold text-sidebar-accent-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
    collapsible && 'max-lg:justify-center max-lg:px-2',
  );

function NavLabel({
  children,
  collapsible,
}: {
  children: React.ReactNode;
  collapsible: boolean;
}) {
  return <span className={cn(collapsible && 'max-lg:hidden')}>{children}</span>;
}

function WithRailTooltip({
  label,
  collapsible,
  children,
}: {
  label: string;
  collapsible: boolean;
  children: React.ReactNode;
}) {
  if (!collapsible) {
    return <>{children}</>;
  }
  return (
    <Tooltip>
      <TooltipTrigger asChild>{children}</TooltipTrigger>
      <TooltipContent side="right" className="lg:hidden">
        {label}
      </TooltipContent>
    </Tooltip>
  );
}

export function SidebarBrand({
  collapsible = false,
}: {
  collapsible?: boolean;
}) {
  return (
    <div
      className={cn(
        'flex items-center gap-2.5 px-2 pb-4',
        collapsible && 'max-lg:justify-center max-lg:px-0',
      )}
    >
      <span
        aria-hidden="true"
        className="flex size-8 shrink-0 items-center justify-center rounded-[10px] bg-primary-soft text-sm font-bold text-primary-soft-foreground"
      >
        C
      </span>
      <span
        className={cn(
          'text-sm font-semibold tracking-tight',
          collapsible && 'max-lg:hidden',
        )}
      >
        COINTRAMIN
      </span>
    </div>
  );
}

export function SidebarNav({
  permissions,
  collapsible = false,
  onNavigate,
}: {
  permissions: string[];
  collapsible?: boolean;
  onNavigate?: () => void;
}) {
  const pathname = usePathname();
  const sections = MENU_SECTIONS.map((section) => ({
    ...section,
    items: section.items.filter(
      (item) =>
        !item.requiredPermission ||
        hasPermission(permissions, item.requiredPermission),
    ),
  })).filter((section) => section.items.length > 0);

  return (
    <nav
      aria-label="Navegación principal"
      className="flex flex-1 flex-col gap-1"
    >
      {sections.map((section) => (
        <div key={section.label} className="flex flex-col gap-1">
          <span
            className={cn(
              'px-3 pt-4 pb-1 text-[11px] font-medium tracking-[0.08em] text-muted-foreground uppercase',
              collapsible && 'max-lg:hidden',
            )}
          >
            {section.label}
          </span>
          {section.items.map((item) => {
            const isActive = pathname.startsWith(item.href);
            const Icon = item.icon;
            return (
              <WithRailTooltip
                key={item.href}
                label={item.label}
                collapsible={collapsible}
              >
                <Link
                  href={item.href}
                  aria-current={isActive ? 'page' : undefined}
                  onClick={onNavigate}
                  className={itemClass(isActive, collapsible)}
                >
                  {isActive && (
                    <span
                      aria-hidden="true"
                      className="absolute top-2 bottom-2 -left-3 w-[3px] rounded-r-full bg-primary"
                    />
                  )}
                  <Icon className="size-4 shrink-0" aria-hidden="true" />
                  <NavLabel collapsible={collapsible}>{item.label}</NavLabel>
                </Link>
              </WithRailTooltip>
            );
          })}
        </div>
      ))}
    </nav>
  );
}

export function SidebarFoot({
  collapsible = false,
  onNavigate,
}: {
  collapsible?: boolean;
  onNavigate?: () => void;
}) {
  const pathname = usePathname();
  const isActive = pathname.startsWith('/perfil');

  return (
    <div className="flex flex-col gap-1 border-t border-border-subtle pt-3">
      <WithRailTooltip label="Mi perfil" collapsible={collapsible}>
        <Link
          href="/perfil"
          aria-current={isActive ? 'page' : undefined}
          onClick={onNavigate}
          className={itemClass(isActive, collapsible)}
        >
          {isActive && (
            <span
              aria-hidden="true"
              className="absolute top-2 bottom-2 -left-3 w-[3px] rounded-r-full bg-primary"
            />
          )}
          <UserRound className="size-4 shrink-0" aria-hidden="true" />
          <NavLabel collapsible={collapsible}>Mi perfil</NavLabel>
        </Link>
      </WithRailTooltip>
      <WithRailTooltip label="Cerrar sesión" collapsible={collapsible}>
        <button
          type="button"
          onClick={() => signOut({ redirectTo: '/login' })}
          className={itemClass(false, collapsible)}
        >
          <LogOut className="size-4 shrink-0" aria-hidden="true" />
          <NavLabel collapsible={collapsible}>Cerrar sesión</NavLabel>
        </button>
      </WithRailTooltip>
    </div>
  );
}
