import type { UseFormReturn } from 'react-hook-form';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import { toast } from 'sonner';
import { ApiError } from './envelope';
import { applyApiFormError, toastApiError } from './form-errors';

vi.mock('sonner', () => ({
  toast: { error: vi.fn() },
}));

/** Doble mínimo del formulario: solo lo que consume `applyApiFormError`. */
function fakeForm() {
  return {
    setError: vi.fn(),
    setFocus: vi.fn(),
  } as unknown as UseFormReturn<{ numberIdentity: string }> & {
    setError: ReturnType<typeof vi.fn>;
    setFocus: ReturnType<typeof vi.fn>;
  };
}

function apiError(code: string, message = 'Mensaje del catálogo.') {
  return new ApiError(
    { code, message, traceId: 'trace-1', timestamp: '2026-03-01T00:00:00Z' },
    409,
  );
}

describe('applyApiFormError', () => {
  beforeEach(() => {
    vi.mocked(toast.error).mockClear();
  });

  it('marca el campo dueño del error y le lleva el foco', () => {
    const form = fakeForm();

    applyApiFormError(apiError('ASSOCIATE_ALREADY_EXISTS'), form, {
      ASSOCIATE_ALREADY_EXISTS: 'numberIdentity',
    });

    expect(form.setError).toHaveBeenCalledWith('numberIdentity', {
      type: 'server',
      message: 'Mensaje del catálogo.',
    });
    expect(form.setFocus).toHaveBeenCalledWith('numberIdentity');
    expect(toast.error).not.toHaveBeenCalled();
  });

  it('usa el error de formulario (root) sin mover el foco a ningún campo', () => {
    const form = fakeForm();

    applyApiFormError(apiError('NOTE_DUPLICATED'), form, {
      NOTE_DUPLICATED: 'root',
    });

    expect(form.setError).toHaveBeenCalledWith('root', expect.any(Object));
    expect(form.setFocus).not.toHaveBeenCalled();
    expect(toast.error).not.toHaveBeenCalled();
  });

  it('cae a toast cuando el código no tiene campo asociado', () => {
    const form = fakeForm();

    applyApiFormError(apiError('INTERNAL_ERROR'), form, {
      NOTE_DUPLICATED: 'root',
    });

    expect(form.setError).not.toHaveBeenCalled();
    expect(toast.error).toHaveBeenCalled();
  });

  it('cae a toast con errores que no son del API', () => {
    const form = fakeForm();

    applyApiFormError(new Error('boom'), form, {
      NOTE_DUPLICATED: 'root',
    });

    expect(form.setError).not.toHaveBeenCalled();
    expect(toast.error).toHaveBeenCalled();
  });
});

describe('toastApiError', () => {
  beforeEach(() => {
    vi.mocked(toast.error).mockClear();
  });

  it('es persistente: el usuario decide cuándo cerrarlo', () => {
    toastApiError(
      apiError('IDENTITY_TYPE_IN_USE', 'Hay asociados con este tipo.'),
    );

    expect(toast.error).toHaveBeenCalledWith('Hay asociados con este tipo.', {
      duration: Infinity,
    });
  });
});
