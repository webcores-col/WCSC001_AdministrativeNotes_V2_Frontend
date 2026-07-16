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

/**
 * Un ítem por módulo real del backend (ver guía de integración, §8) — nada
 * más. `requiredPermission` decide visibilidad contra `permissions[]` de la
 * sesión real, no contra un rol hardcodeado.
 */
export const MENU_ITEMS: MenuItem[] = [
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
];
