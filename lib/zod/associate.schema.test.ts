import { describe, expect, it } from 'vitest';
import {
  createAssociateSchema,
  updateAssociateSchema,
} from './associate.schema';

const validCreate = {
  numberIdentity: '1045228917',
  typeIdentity: 'CC',
  names: 'María',
  surname1: 'García',
  surname2: '',
  dateBirth: '1990-01-01',
  status: 'ACTIVE' as const,
};

describe('createAssociateSchema', () => {
  it('acepta un alta válida', () => {
    expect(createAssociateSchema.safeParse(validCreate).success).toBe(true);
  });

  it('exige el número de identificación', () => {
    const result = createAssociateSchema.safeParse({
      ...validCreate,
      numberIdentity: '',
    });
    expect(result.success).toBe(false);
  });

  it('rechaza fecha de nacimiento futura', () => {
    const result = createAssociateSchema.safeParse({
      ...validCreate,
      dateBirth: '2999-01-01',
    });
    expect(result.success).toBe(false);
  });

  it('acepta la fecha de hoy como nacimiento (límite)', () => {
    const today = new Date().toISOString().slice(0, 10);
    expect(
      createAssociateSchema.safeParse({ ...validCreate, dateBirth: today })
        .success,
    ).toBe(true);
  });

  it('rechaza estados fuera del enum', () => {
    expect(
      createAssociateSchema.safeParse({ ...validCreate, status: 'PENDING' })
        .success,
    ).toBe(false);
  });
});

describe('updateAssociateSchema', () => {
  it('no admite numberIdentity (PK natural, no se edita)', () => {
    const { numberIdentity: _omitted, ...rest } = validCreate;
    const result = updateAssociateSchema.safeParse(rest);
    expect(result.success).toBe(true);
    // strip por defecto de zod: si llega, se descarta en vez de aceptarse.
    const withPk = updateAssociateSchema.parse(validCreate);
    expect('numberIdentity' in withPk).toBe(false);
  });
});
