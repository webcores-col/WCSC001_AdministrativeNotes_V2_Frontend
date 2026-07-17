import { createHttpClient } from './http';

/**
 * Cliente que habla directo con el backend real (`BACKEND_URL` — red Docker
 * interna en producción). Uso exclusivo desde Route Handlers y Server
 * Components; el navegador nunca debe conocer esta URL. No inyecta
 * `Authorization` por sí solo: cada caller server-side arma el header con
 * `(await auth()).accessToken` vía `options.headers` (mismo patrón que
 * `app/api/v1/[...path]/route.ts`). La mayoría de las vistas de datos usan
 * en cambio `proxyClient` desde hooks de TanStack Query (Fase 5+).
 */
export const serverClient = createHttpClient(
  `${process.env.BACKEND_URL}/api/v1`,
);
