import path from 'node:path';
import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';

dotenv.config({ path: path.join(__dirname, '.env.local') });

const baseURL = process.env.E2E_BASE_URL ?? 'http://localhost:3001';

/**
 * Requiere el backend V2 corriendo localmente (mismo requisito que
 * `npm run dev`, ver README) y las credenciales E2E_ADMIN_USERNAME/
 * E2E_ADMIN_PASSWORD en `.env.local` (ver `.env.example`) — el usuario
 * ADMIN semilla del backend.
 */
export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: process.env.CI ? [['github'], ['html', { open: 'never' }]] : 'html',
  use: {
    baseURL,
    trace: 'on-first-retry',
  },
  projects: [
    { name: 'setup', testMatch: /.*\.setup\.ts/ },
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        storageState: 'tests/e2e/.auth/admin.json',
      },
      dependencies: ['setup'],
    },
  ],
  webServer: {
    /*
     * El puerto se pasa explícito y se deriva de `baseURL`: sin él,
     * `next dev` toma el 3000 —el del backend— y solo funciona de casualidad,
     * porque al encontrarlo ocupado Next cae al 3001. Ese fallback no ocurre
     * cuando `PORT` viene definido en el entorno (el pipeline lo fija en 3000
     * para el backend): ahí Next respeta la variable y muere con EADDRINUSE.
     */
    command: `npm run dev -- --port ${new URL(baseURL).port || '3001'}`,
    url: baseURL,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
