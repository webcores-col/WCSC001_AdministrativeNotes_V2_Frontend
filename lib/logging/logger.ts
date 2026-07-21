import pino from 'pino';

/**
 * JSON a stdout (mismo criterio que el backend): en el VPS se lee con
 * `docker logs wcsc001-frontend`, buscando por `traceId` para cruzar con
 * los logs del backend.
 */
export const logger = pino({
  level: process.env.LOG_LEVEL ?? 'info',
});
