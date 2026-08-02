import type { FieldValues, Path, UseFormReturn } from 'react-hook-form';
import { toast } from 'sonner';
import { ApiError } from './envelope';
import { getErrorMessage } from './error-message';

/**
 * Feedback de errores según el plan §8: un error de negocio que pertenece a
 * un campo se muestra inline en el campo (nunca solo como toast); el resto
 * cae a un toast de error persistente (no se autodescartan: un toast nunca
 * es el único registro de un error y el usuario decide cuándo cerrarlo).
 */

/** Toast de error persistente — para errores que no pertenecen a un campo. */
export function toastApiError(error: unknown): void {
  toast.error(getErrorMessage(error), { duration: Infinity });
}

/**
 * Enruta el error de una mutación de formulario: si `error.code` está en
 * `fieldByCode` se marca inline con `setError` (y `root` se pinta donde el
 * formulario renderice `formState.errors.root`); si no, toast persistente.
 * El foco al campo con error lo da el propio `setError` + `shouldFocus` no
 * está disponible aquí, así que se enfoca explícitamente vía `setFocus`.
 */
export function applyApiFormError<T extends FieldValues>(
  error: unknown,
  form: UseFormReturn<T>,
  fieldByCode: Record<string, Path<T> | 'root'>,
): void {
  if (error instanceof ApiError) {
    const target = fieldByCode[error.code];
    if (target) {
      form.setError(target, {
        type: 'server',
        message: getErrorMessage(error),
      });
      if (target !== 'root') {
        form.setFocus(target);
      }
      return;
    }
  }
  toastApiError(error);
}
