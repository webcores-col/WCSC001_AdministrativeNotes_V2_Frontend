import { ApiError } from './envelope';

const FALLBACK_MESSAGE = 'Ocurrió un error inesperado. Intente de nuevo.';
const NETWORK_ERROR_MESSAGE =
  'No se pudo conectar con el servidor. Verifique su conexión e intente de nuevo.';

/**
 * Mensaje mostrable al usuario para cualquier error capturado en la UI
 * (mutaciones, queries, formularios). `ApiError.message` ya viene en
 * español desde el backend (ver guía de integración, §5) y se usa tal cual;
 * los errores de red (fetch rechazado por CORS/offline/DNS, típicamente un
 * `TypeError`) y cualquier otro caso no identificado caen a un mensaje
 * genérico en vez de exponer detalles técnicos.
 */
export function getErrorMessage(error: unknown): string {
  if (error instanceof ApiError) {
    return error.message || FALLBACK_MESSAGE;
  }
  if (error instanceof TypeError) {
    return NETWORK_ERROR_MESSAGE;
  }
  if (error instanceof Error) {
    return error.message || FALLBACK_MESSAGE;
  }
  return FALLBACK_MESSAGE;
}
