import { describe, expect, it } from 'vitest';
import {
  changeMyPasswordSchema,
  createUserSchema,
  resetPasswordSchema,
} from './user.schema';

const validUser = {
  code: 'U010',
  names: 'Kevin',
  surnames: 'Martínez',
  username: 'kmartinez',
  password: 'ClaveSegura1',
  role: 'OPERATOR' as const,
};

describe('createUserSchema', () => {
  it('acepta un usuario válido', () => {
    expect(createUserSchema.safeParse(validUser).success).toBe(true);
  });

  it('aplica la política de contraseña: 8+, letras y números', () => {
    expect(
      createUserSchema.safeParse({ ...validUser, password: 'Corta1' }).success,
    ).toBe(false);
    expect(
      createUserSchema.safeParse({ ...validUser, password: '12345678' })
        .success,
    ).toBe(false);
    expect(
      createUserSchema.safeParse({ ...validUser, password: 'SoloLetras' })
        .success,
    ).toBe(false);
  });

  it('rechaza roles fuera del catálogo', () => {
    expect(
      createUserSchema.safeParse({ ...validUser, role: 'SUPERADMIN' }).success,
    ).toBe(false);
  });
});

describe('resetPasswordSchema', () => {
  it('reutiliza la política de contraseña', () => {
    expect(
      resetPasswordSchema.safeParse({ newPassword: 'NuevaClave9' }).success,
    ).toBe(true);
    expect(
      resetPasswordSchema.safeParse({ newPassword: 'corta' }).success,
    ).toBe(false);
  });
});

describe('changeMyPasswordSchema', () => {
  const valid = {
    currentPassword: 'ActualClave1',
    newPassword: 'NuevaClave9',
    confirmPassword: 'NuevaClave9',
  };

  it('acepta el cambio cuando la confirmación coincide', () => {
    expect(changeMyPasswordSchema.safeParse(valid).success).toBe(true);
  });

  it('marca la confirmación cuando no coincide', () => {
    const result = changeMyPasswordSchema.safeParse({
      ...valid,
      confirmPassword: 'Distinta123',
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0]?.path).toEqual(['confirmPassword']);
    }
  });
});
