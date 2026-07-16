import { describe, expect, it } from 'vitest';
import { ApiError } from './envelope';
import { getErrorMessage } from './error-message';

describe('getErrorMessage', () => {
  it('usa el message de ApiError tal cual (viene en español del backend)', () => {
    const error = new ApiError(
      {
        code: 'NOTE_DUPLICATED',
        message: 'Ya existe un pagaré con esta información.',
        traceId: 'abc',
        timestamp: '2026-07-11T03:14:29.787Z',
      },
      409,
    );

    expect(getErrorMessage(error)).toBe(
      'Ya existe un pagaré con esta información.',
    );
  });

  it('devuelve un mensaje de red genérico para un TypeError de fetch', () => {
    const error = new TypeError('Failed to fetch');
    expect(getErrorMessage(error)).toMatch(/no se pudo conectar/i);
  });

  it('usa el message de un Error genérico', () => {
    expect(getErrorMessage(new Error('algo específico'))).toBe(
      'algo específico',
    );
  });

  it('cae a un mensaje genérico para valores no-Error', () => {
    expect(getErrorMessage('string suelto')).toMatch(/error inesperado/i);
    expect(getErrorMessage(undefined)).toMatch(/error inesperado/i);
  });
});
