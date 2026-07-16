import { unwrapEnvelope } from '@/lib/api/envelope';
import { getTokenExpiryMs } from './decode-jwt';
import type { SessionUser, TokenPair } from './session-types';

export interface RefreshResult extends TokenPair {
  user: SessionUser;
}

/**
 * Deduplicación en proceso de refreshes concurrentes del mismo refresh
 * token (patrón single-flight, análogo a `golang.org/x/sync/singleflight`).
 *
 * Por qué existe (ver ADR-001): el refresh token del backend es de un solo
 * uso y su reuso se trata como robo de sesión — revoca TODAS las sesiones
 * del usuario (guía de integración del backend, §3). Si varias peticiones
 * llegan a este servidor en el instante en que expira el access token, cada
 * una llamaría a `POST /auth/refresh` de forma independiente con el mismo
 * refresh token (todavía no rotado); solo la primera tendría éxito y el
 * resto reusaría un token ya consumido, disparando la detección de robo del
 * backend y cerrando la sesión. Indexar la promesa en vuelo por el valor del
 * refresh token garantiza una sola llamada de red por rotación.
 *
 * Límite conocido: el caché es por proceso de Node — correcto con una
 * réplica (caso actual del despliegue). Escalar horizontalmente exigiría un
 * store compartido (Redis u otro), que no forma parte de esta
 * infraestructura hoy.
 */
const inFlightRefreshes = new Map<string, Promise<RefreshResult>>();

export function refreshAccessToken(
  refreshToken: string,
): Promise<RefreshResult> {
  const existing = inFlightRefreshes.get(refreshToken);
  if (existing) {
    return existing;
  }

  const promise = performRefresh(refreshToken).finally(() => {
    inFlightRefreshes.delete(refreshToken);
  });
  inFlightRefreshes.set(refreshToken, promise);
  return promise;
}

interface RefreshResponseData {
  accessToken: string;
  refreshToken: string;
  user: SessionUser;
}

async function performRefresh(refreshToken: string): Promise<RefreshResult> {
  const response = await fetch(
    `${process.env.BACKEND_URL}/api/v1/auth/refresh`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken }),
    },
  );

  const body: unknown = await response.json().catch(() => undefined);
  const { data } = unwrapEnvelope<RefreshResponseData>(body, response.status);

  return {
    accessToken: data.accessToken,
    refreshToken: data.refreshToken,
    accessTokenExpires: getTokenExpiryMs(data.accessToken),
    user: data.user,
  };
}
