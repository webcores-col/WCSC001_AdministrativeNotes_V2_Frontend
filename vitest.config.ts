import { fileURLToPath } from 'node:url';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./tests/setup.ts'],
    // tests/e2e/ son specs de Playwright (otro test runner) — excluirlos
    // evita que Vitest los recoja también por el patrón *.spec.ts.
    exclude: ['**/node_modules/**', 'tests/e2e/**'],
    globals: true,
    css: false,
    coverage: {
      provider: 'v8',
      include: ['lib/**/*.ts', 'lib/**/*.tsx'],
      // Fuera del umbral unitario, con motivo:
      // - lib/query/**: hooks de TanStack Query — son wiring de integración
      //   (QueryClient + fetch real) y los cubren los e2e con backend real,
      //   no tests unitarios con el fetch simulado.
      // - lib/logging/**: singleton de pino (side effects al importar).
      exclude: [
        'lib/api/generated/**',
        '**/*.d.ts',
        'lib/query/**',
        'lib/logging/**',
      ],
      thresholds: {
        lines: 70,
        functions: 70,
        branches: 60,
        statements: 70,
      },
    },
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('.', import.meta.url)),
    },
  },
});
