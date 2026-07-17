import { unwrapEnvelope, type PageMeta } from './envelope';

export interface RequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  query?: Record<string, string | number | boolean | undefined>;
  body?: unknown;
  headers?: Record<string, string>;
}

/**
 * Fábrica de cliente HTTP mínimo, propio (no openapi-fetch): las respuestas
 * reales del backend siempre vienen envueltas en el envelope
 * (`{ data, meta? }` / `{ error }`), pero el contrato OpenAPI documenta el
 * tipo del `data` interno, no el envelope completo — el interceptor global
 * que aplica el envelope es invisible para la generación de Swagger. Un
 * cliente que confiara en el tipado automático de respuesta de
 * openapi-fetch reportaría un tipo incorrecto en tiempo de compilación (el
 * envelope, no el DTO). Por eso este wrapper solo usa los tipos generados
 * para los DTOs (`lib/api/types.ts`) del lado de la respuesta, y siempre la
 * resuelve con `unwrapEnvelope`, la única fuente de verdad sobre éxito/error.
 */
export function createHttpClient(baseUrl: string) {
  return async function request<T>(
    path: string,
    options: RequestOptions = {},
  ): Promise<{ data: T; meta?: PageMeta }> {
    const response = await fetch(buildUrl(baseUrl, path, options.query), {
      method: options.method ?? 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      body:
        options.body !== undefined ? JSON.stringify(options.body) : undefined,
      cache: 'no-store',
    });

    // 204 (p. ej. DELETE /notes/:id) no trae cuerpo que envolver — intentar
    // parsear JSON y desempaquetar un envelope inexistente siempre fallaría.
    if (response.status === 204) {
      return { data: undefined as T };
    }

    const body: unknown = await response.json().catch(() => undefined);
    return unwrapEnvelope<T>(body, response.status);
  };
}

function buildUrl(
  baseUrl: string,
  path: string,
  query?: RequestOptions['query'],
): string {
  const params = new URLSearchParams();
  if (query) {
    for (const [key, value] of Object.entries(query)) {
      if (value !== undefined) params.set(key, String(value));
    }
  }
  const queryString = params.toString();
  return `${baseUrl}${path}${queryString ? `?${queryString}` : ''}`;
}
