'use client';

import {
  SidebarBrand,
  SidebarFoot,
  SidebarNav,
} from '@/components/layout/SidebarNav';
import { TooltipProvider } from '@/components/ui/tooltip';

/**
 * Sidebar de escritorio: 264px en `lg+`, rail de iconos de 72px entre `md`
 * y `lg` (labels en tooltip), oculto en `< md` (ahí navega el drawer de
 * MobileNav). Plan de diseño §5.1.
 */
export function Sidebar({ permissions }: { permissions: string[] }) {
  return (
    <TooltipProvider>
      <aside className="sticky top-0 hidden h-screen w-[72px] shrink-0 flex-col overflow-y-auto border-r border-sidebar-border bg-sidebar px-3 py-4 md:flex lg:w-[264px]">
        <SidebarBrand collapsible />
        <SidebarNav permissions={permissions} collapsible />
        <SidebarFoot collapsible />
      </aside>
    </TooltipProvider>
  );
}
