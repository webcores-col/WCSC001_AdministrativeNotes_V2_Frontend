/**
 * Desempaqueta el envelope de respuestas del backend real (ver guía de
 * integración, §5): éxito `{ data, meta? }`, error
 * `{ error: { code, message, details?, traceId, timestamp } }`.
 */

export interface PageMeta {
  page: number;
  size: number;
  total: number;
}

export interface ApiErrorDetail {
  field: string;
  constraints: string[];
}

export interface ApiErrorBody {
  code: string;
  message: string;
  details?: ApiErrorDetail[];
  traceId: string;
  timestamp: string;
}

interface SuccessEnvelope<T> {
  data: T;
  meta?: PageMeta;
}

interface ErrorEnvelope {
  error: ApiErrorBody;
}

/**
 * La UI debe decidir siempre por `code` (estable entre versiones), nunca por
 * `message` (puede cambiar sin previo aviso) — ver guía de integración, §5.
 */
export class ApiError extends Error {
  readonly code: string;
  readonly httpStatus: number;
  readonly details?: ApiErrorDetail[];
  readonly traceId: string;

  constructor(body: ApiErrorBody, httpStatus: number) {
    super(body.message);
    this.name = 'ApiError';
    this.code = body.code;
    this.httpStatus = httpStatus;
    this.details = body.details;
    this.traceId = body.traceId;
  }
}

export function unwrapEnvelope<T>(
  body: unknown,
  httpStatus: number,
): { data: T; meta?: PageMeta } {
  if (isErrorEnvelope(body)) {
    throw new ApiError(body.error, httpStatus);
  }
  if (isSuccessEnvelope<T>(body)) {
    return { data: body.data, meta: body.meta };
  }
  throw new ApiError(
    {
      code: 'UNEXPECTED_RESPONSE_SHAPE',
      message: 'Respuesta inesperada del servidor.',
      traceId: '',
      timestamp: new Date().toISOString(),
    },
    httpStatus,
  );
}

function isErrorEnvelope(body: unknown): body is ErrorEnvelope {
  return (
    typeof body === 'object' &&
    body !== null &&
    'error' in body &&
    typeof (body as { error: unknown }).error === 'object' &&
    (body as { error: unknown }).error !== null
  );
}

function isSuccessEnvelope<T>(body: unknown): body is SuccessEnvelope<T> {
  return typeof body === 'object' && body !== null && 'data' in body;
}
