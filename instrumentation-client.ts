import * as Sentry from '@sentry/nextjs';

// Sin DSN el SDK no se inicializa — no-op en desarrollo local y en tests.
if (process.env.NEXT_PUBLIC_SENTRY_DSN) {
  Sentry.init({
    dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
    environment: process.env.NODE_ENV,
    tracesSampleRate: Number(
      process.env.NEXT_PUBLIC_SENTRY_TRACES_SAMPLE_RATE ?? 0.1,
    ),
  });
}

export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;
