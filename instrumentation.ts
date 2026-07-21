import * as Sentry from '@sentry/nextjs';

/**
 * `register()` corre una vez por instancia (node y edge) antes de atender
 * peticiones — `Sentry.init` es runtime-aware internamente, no hace falta
 * ramificar por `NEXT_RUNTIME` como en el ejemplo genérico de Next.js.
 * Sin DSN, no-op (mismo criterio que el backend).
 */
export async function register() {
  if (process.env.NEXT_PUBLIC_SENTRY_DSN) {
    Sentry.init({
      dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
      environment: process.env.NODE_ENV,
      tracesSampleRate: Number(
        process.env.NEXT_PUBLIC_SENTRY_TRACES_SAMPLE_RATE ?? 0.1,
      ),
    });
  }
}

// Captura automática de errores de Server Components, Route Handlers,
// Server Actions y el proxy — ver docs/PLAN_ARQUITECTURA.md, Fase 11.
export const onRequestError = Sentry.captureRequestError;
