import { describe, expect, it } from 'vitest';
import { createNoteSchema } from './note.schema';

const base = {
  associateId: 'A1',
  typeNote: 'LI',
  codeudor1Id: '',
  codeudor2Id: '',
};

describe('createNoteSchema', () => {
  it('acepta pagaré sin codeudores', () => {
    expect(createNoteSchema.safeParse(base).success).toBe(true);
  });

  it('exige deudor y tipo', () => {
    expect(
      createNoteSchema.safeParse({ ...base, associateId: '' }).success,
    ).toBe(false);
    expect(createNoteSchema.safeParse({ ...base, typeNote: '' }).success).toBe(
      false,
    );
  });

  it('rechaza codeudor igual al deudor, con el error en su campo', () => {
    const result = createNoteSchema.safeParse({ ...base, codeudor1Id: 'A1' });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0]?.path).toEqual(['codeudor1Id']);
    }
    expect(
      createNoteSchema.safeParse({ ...base, codeudor2Id: 'A1' }).success,
    ).toBe(false);
  });

  it('rechaza codeudores repetidos entre sí', () => {
    const result = createNoteSchema.safeParse({
      ...base,
      codeudor1Id: 'B2',
      codeudor2Id: 'B2',
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0]?.path).toEqual(['codeudor2Id']);
    }
  });

  it('acepta dos codeudores distintos', () => {
    expect(
      createNoteSchema.safeParse({
        ...base,
        codeudor1Id: 'B2',
        codeudor2Id: 'C3',
      }).success,
    ).toBe(true);
  });
});
