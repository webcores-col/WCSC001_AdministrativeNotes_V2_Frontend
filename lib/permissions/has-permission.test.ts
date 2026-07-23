import { describe, expect, it } from 'vitest';
import { hasAnyPermission, hasPermission } from './has-permission';
import { isPermissionCode } from './permission-catalog';

describe('hasPermission', () => {
  it('acepta cuando la sesión tiene el permiso requerido', () => {
    expect(hasPermission(['notes:read', 'notes:create'], 'notes:read')).toBe(
      true,
    );
  });

  it('rechaza cuando falta el permiso', () => {
    expect(hasPermission(['notes:read'], 'notes:delete')).toBe(false);
  });

  it('con lista requerida exige TODOS los permisos', () => {
    expect(
      hasPermission(
        ['notes:read', 'notes:create'],
        ['notes:read', 'notes:create'],
      ),
    ).toBe(true);
    expect(hasPermission(['notes:read'], ['notes:read', 'notes:delete'])).toBe(
      false,
    );
  });

  it('rechaza sesión sin permisos o indefinida (sesión aún cargando)', () => {
    expect(hasPermission(undefined, 'notes:read')).toBe(false);
    expect(hasPermission([], 'notes:read')).toBe(false);
  });

  it('tolera permisos desconocidos del backend sin romper', () => {
    // Un permiso nuevo en el backend que este frontend no conoce no debe
    // habilitar nada, pero tampoco lanzar.
    expect(hasPermission(['nuevo:permiso'], 'notes:read')).toBe(false);
  });
});

describe('hasAnyPermission', () => {
  it('acepta cuando la sesión tiene al menos uno', () => {
    expect(
      hasAnyPermission(['catalogs:read'], ['catalogs:manage', 'catalogs:read']),
    ).toBe(true);
  });

  it('rechaza cuando no tiene ninguno o la sesión está vacía', () => {
    expect(hasAnyPermission(['notes:read'], ['users:read'])).toBe(false);
    expect(hasAnyPermission(undefined, ['users:read'])).toBe(false);
  });
});

describe('isPermissionCode', () => {
  it('reconoce códigos del catálogo y rechaza desconocidos', () => {
    expect(isPermissionCode('notes:read')).toBe(true);
    expect(isPermissionCode('otra:cosa')).toBe(false);
  });
});
