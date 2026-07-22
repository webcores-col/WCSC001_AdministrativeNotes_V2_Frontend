import type { LucideIcon } from 'lucide-react';
import { FileText, LayoutDashboard, Tags, UserCog, Users } from 'lucide-react';
import type { PermissionCode } from '@/lib/permissions/permission-catalog';

export type MenuItem = {
  label: string;
  href: string;
  icon: LucideIcon;
  /** Sin permiso requerido = visible para cualquier sesión válida (p. ej. Dashboard). */
  requiredPermission?: PermissionCode;
};

export type MenuSection = {
  label: string;
  items: MenuItem[];
};

/**
 * Un ítem por módulo real del backend (ver guía de integración, §8) — nada
 * más. `requiredPermission` decide visibilidad contra `permissions[]` de la
 * sesión real, no contra un rol hardcodeado. Las secciones son la jerarquía
 * visual del sidebar (plan de diseño §5.1): operación diaria arriba,
 * administración abajo.
 */
export const MENU_SECTIONS: MenuSection[] = [
  {
    label: 'Menú principal',
    items: [
      { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
      {
        label: 'Asociados',
        href: '/asociados',
        icon: Users,
        requiredPermission: 'associates:read',
      },
      {
        label: 'Pagarés',
        href: '/pagares',
        icon: FileText,
        requiredPermission: 'notes:read',
      },
    ],
  },
  {
    label: 'Administración',
    items: [
      {
        label: 'Catálogos',
        href: '/catalogos/tipos-identificacion',
        icon: Tags,
        requiredPermission: 'catalogs:read',
      },
      {
        label: 'Usuarios',
        href: '/usuarios',
        icon: UserCog,
        requiredPermission: 'users:read',
      },
    ],
  },
];

/** Lista plana para lookups por ruta (p. ej. el título corto del topbar). */
export const MENU_ITEMS: MenuItem[] = MENU_SECTIONS.flatMap(
  (section) => section.items,
);
