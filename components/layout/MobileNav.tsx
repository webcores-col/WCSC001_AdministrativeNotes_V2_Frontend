'use client';

import { Menu } from 'lucide-react';
import { useState } from 'react';
import {
  SidebarBrand,
  SidebarFoot,
  SidebarNav,
} from '@/components/layout/SidebarNav';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';

/** Drawer de navegación en `< md`; en `md+` el sidebar propio lo reemplaza. */
export function MobileNav({ permissions }: { permissions: string[] }) {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          aria-label="Abrir menú"
        >
          <Menu aria-hidden="true" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[280px] px-3 py-4">
        <SheetTitle className="sr-only">Navegación principal</SheetTitle>
        <SidebarBrand />
        <SidebarNav permissions={permissions} onNavigate={close} />
        <SidebarFoot onNavigate={close} />
      </SheetContent>
    </Sheet>
  );
}
