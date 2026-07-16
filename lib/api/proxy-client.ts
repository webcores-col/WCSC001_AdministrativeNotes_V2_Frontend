'use client';

import { createHttpClient } from './http';

/**
 * Cliente que habla con el proxy same-origin (`/api/v1/*`), nunca directo
 * con el backend — el navegador no debe conocer `BACKEND_URL` ni manejar
 * tokens (ver ADR-001). Uso en componentes cliente (hooks de TanStack Query).
 */
export const proxyClient = createHttpClient('/api/v1');
