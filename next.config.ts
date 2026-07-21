import type { NextConfig } from 'next';
import { withSentryConfig } from '@sentry/nextjs';

const nextConfig: NextConfig = {
  output: 'standalone',
};

// Sin NEXT_PUBLIC_SENTRY_DSN, instrumentation.ts/instrumentation-client.ts no
// inicializan el SDK (no-op). El upload de source maps (org/project/authToken)
// es opcional: sin SENTRY_AUTH_TOKEN el plugin lo omite en vez de fallar el
// build — no se configuran acá, se leen de las mismas variables de entorno
// estándar de Sentry si el usuario decide activarlo más adelante.
export default withSentryConfig(nextConfig, {
  silent: !process.env.CI,
  widenClientFileUpload: true,
});
