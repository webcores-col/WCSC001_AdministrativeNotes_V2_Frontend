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
      exclude: ['lib/api/generated/**', '**/*.d.ts'],
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
