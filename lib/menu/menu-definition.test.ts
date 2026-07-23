import { describe, expect, it } from 'vitest';
import { isPermissionCode } from '@/lib/permissions/permission-catalog';
import { MENU_ITEMS, MENU_SECTIONS } from './menu-definition';

describe('menu-definition', () => {
  it('cada ítem tiene label, href e icono, sin rutas repetidas', () => {
    const hrefs = MENU_ITEMS.map((item) => item.href);
    expect(new Set(hrefs).size).toBe(hrefs.length);
    for (const item of MENU_ITEMS) {
      expect(item.label.length).toBeGreaterThan(0);
      expect(item.href.startsWith('/')).toBe(true);
      // Los iconos de lucide son componentes forwardRef (objetos), no
      // funciones planas — basta con que exista uno por ítem.
      expect(item.icon).toBeTruthy();
    }
  });

  it('todo requiredPermission existe en el catálogo local', () => {
    for (const item of MENU_ITEMS) {
      if (item.requiredPermission) {
        expect(isPermissionCode(item.requiredPermission)).toBe(true);
      }
    }
  });

  it('la lista plana refleja exactamente las secciones', () => {
    expect(MENU_ITEMS).toEqual(
      MENU_SECTIONS.flatMap((section) => section.items),
    );
  });
});
