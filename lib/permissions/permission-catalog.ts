/**
 * Espejo del catálogo de permisos de `prisma/seed-base.ts` en el backend.
 * Solo estructura el menú y las rutas: la autoridad real en runtime son los
 * `permissions[]` que entrega `POST /auth/login` y `GET /auth/me` — si este
 * catálogo se desfasa, `hasPermission` sigue siendo correcto porque compara
 * contra la lista real de la sesión, no contra este archivo.
 */
export const PERMISSIONS = [
  'users:create',
  'users:read',
  'users:update',
  'associates:create',
  'associates:read',
  'associates:update',
  'notes:create',
  'notes:read',
  'notes:delete',
  'catalogs:read',
  'catalogs:manage',
] as const;

export type PermissionCode = (typeof PERMISSIONS)[number];

export function isPermissionCode(value: string): value is PermissionCode {
  return (PERMISSIONS as readonly string[]).includes(value);
}
