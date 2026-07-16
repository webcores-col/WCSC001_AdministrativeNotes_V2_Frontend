import { describe, expect, it } from 'vitest';
import { ApiError, unwrapEnvelope } from './envelope';

// Fixtures literales de docs/functional/guia-integracion.md del backend.

describe('unwrapEnvelope', () => {
  it('devuelve data para un envelope de éxito simple', () => {
    const body = {
      data: {
        accessToken: 'eyJhbGciOiJIUzI1NiIs…',
        refreshToken: '626d0008-….10d87794…',
        user: {
          code: 'USR001',
          username: 'jperez',
          names: 'Juan',
          surnames: 'Pérez',
          role: 'OPERATOR',
          permissions: ['associates:create', 'associates:read', 'notes:create'],
        },
      },
    };

    const result = unwrapEnvelope<{ accessToken: string }>(body, 200);

    expect(result.data.accessToken).toBe('eyJhbGciOiJIUzI1NiIs…');
    expect(result.meta).toBeUndefined();
  });

  it('devuelve data y meta para un listado paginado', () => {
    const body = {
      data: [{ numberIdentity: '1094123456' }],
      meta: { page: 1, size: 20, total: 134 },
    };

    const result = unwrapEnvelope<{ numberIdentity: string }[]>(body, 200);

    expect(result.data).toHaveLength(1);
    expect(result.meta).toEqual({ page: 1, size: 20, total: 134 });
  });

  it('lanza ApiError con code/httpStatus/traceId para un error simple', () => {
    const body = {
      error: {
        code: 'NOTE_DUPLICATED',
        message: 'Ya existe un pagaré con esta información.',
        traceId: '8f3c1c2e-…',
        timestamp: '2026-07-11T03:14:29.787Z',
      },
    };

    expect(() => unwrapEnvelope(body, 409)).toThrow(ApiError);
    try {
      unwrapEnvelope(body, 409);
      expect.unreachable();
    } catch (error) {
      expect(error).toBeInstanceOf(ApiError);
      const apiError = error as ApiError;
      expect(apiError.code).toBe('NOTE_DUPLICATED');
      expect(apiError.httpStatus).toBe(409);
      expect(apiError.traceId).toBe('8f3c1c2e-…');
      expect(apiError.message).toBe(
        'Ya existe un pagaré con esta información.',
      );
      expect(apiError.details).toBeUndefined();
    }
  });

  it('lanza ApiError con details por campo para un 400 de validación', () => {
    const body = {
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Los datos enviados no son válidos.',
        details: [
          {
            field: 'dateBirth',
            constraints: ['dateBirth no puede ser una fecha futura.'],
          },
        ],
        traceId: 'abc-123',
        timestamp: '2026-07-11T03:14:29.787Z',
      },
    };

    try {
      unwrapEnvelope(body, 400);
      expect.unreachable();
    } catch (error) {
      const apiError = error as ApiError;
      expect(apiError.code).toBe('VALIDATION_ERROR');
      expect(apiError.details).toEqual([
        {
          field: 'dateBirth',
          constraints: ['dateBirth no puede ser una fecha futura.'],
        },
      ]);
    }
  });

  it('lanza ApiError con code UNEXPECTED_RESPONSE_SHAPE si el body no calza con el envelope', () => {
    expect(() => unwrapEnvelope({ foo: 'bar' }, 200)).toThrow(ApiError);
    try {
      unwrapEnvelope(null, 502);
      expect.unreachable();
    } catch (error) {
      expect((error as ApiError).code).toBe('UNEXPECTED_RESPONSE_SHAPE');
      expect((error as ApiError).httpStatus).toBe(502);
    }
  });
});
