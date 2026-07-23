import { describe, expect, it } from 'vitest';
import { createCatalogEntrySchema } from './catalog-entry.schema';
import { loginSchema } from './auth.schema';

describe('loginSchema', () => {
  it('acepta credenciales completas y exige ambas', () => {
    expect(
      loginSchema.safeParse({ username: 'kmartinez', password: 'x' }).success,
    ).toBe(true);
    expect(loginSchema.safeParse({ username: '', password: 'x' }).success).toBe(
      false,
    );
    expect(loginSchema.safeParse({ username: 'k', password: '' }).success).toBe(
      false,
    );
  });
});

describe('createCatalogEntrySchema', () => {
  it('exige código y nombre', () => {
    expect(
      createCatalogEntrySchema.safeParse({ code: 'CC', name: 'Cédula' })
        .success,
    ).toBe(true);
    expect(
      createCatalogEntrySchema.safeParse({ code: '', name: 'Cédula' }).success,
    ).toBe(false);
  });
});
