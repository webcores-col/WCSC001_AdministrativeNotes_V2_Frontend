import type { PermissionCode } from './permission-catalog';

/**
 * La fuente de verdad es siempre la lista de permisos de la sesión (la que
 * entregó el backend en login/`auth/me`), no un catálogo local. Acepta
 * `string[]` (no solo `PermissionCode[]`) porque la sesión de Auth.js guarda
 * lo que el backend devolvió tal cual, sin revalidar contra el catálogo
 * local — así un permiso nuevo en el backend que el frontend aún no conoce
 * simplemente no habilita nada en la UI en vez de romper el tipo.
 */
export function hasPermission(
  sessionPermissions: string[] | undefined,
  required: PermissionCode | PermissionCode[],
): boolean {
  if (!sessionPermissions || sessionPermissions.length === 0) return false;
  const requiredList = Array.isArray(required) ? required : [required];
  return requiredList.every((code) => sessionPermissions.includes(code));
}

export function hasAnyPermission(
  sessionPermissions: string[] | undefined,
  required: PermissionCode[],
): boolean {
  if (!sessionPermissions || sessionPermissions.length === 0) return false;
  return required.some((code) => sessionPermissions.includes(code));
}
