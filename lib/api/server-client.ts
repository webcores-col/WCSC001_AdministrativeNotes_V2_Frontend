import { createHttpClient } from './http';

/**
 * Cliente que habla directo con el backend real (`BACKEND_URL` — red Docker
 * interna en producción). Uso exclusivo desde Route Handlers y Server
 * Components; el navegador nunca debe conocer esta URL. Sin autenticación
 * todavía (Fase 2) — la Fase 3 añade el header `Authorization` al construir
 * las peticiones desde el proxy y los Server Components.
 */
export const serverClient = createHttpClient(
  `${process.env.BACKEND_URL}/api/v1`,
);
