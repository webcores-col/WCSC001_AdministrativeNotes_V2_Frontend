import { expect, test } from '@playwright/test';

/**
 * Este archivo (más el `setup` project de auth.setup.ts) hace peticiones
 * reales a `POST /auth/login`. El backend limita a 5 intentos por minuto
 * por IP (ver docs/functional/modulos.md) — correr la suite completa más
 * de un par de veces seguidas en menos de un minuto puede toparse con
 * `429 RATE_LIMITED` y estos tests fallarán mostrando el mensaje de
 * "demasiados intentos" en vez de navegar. Es el rate limiting real
 * funcionando, no un bug del test: si pasa, esperar ~60s y repetir.
 */
test.use({ storageState: { cookies: [], origins: [] } });

test.describe('Login', () => {
  test('credenciales inválidas muestran un error y no navega', async ({
    page,
  }) => {
    await page.goto('/login');
    await page.getByLabel('Usuario').fill('usuario-inexistente');
    await page.getByLabel('Contraseña').fill('clave-incorrecta');
    await page.getByRole('button', { name: 'Ingresar' }).click();

    await expect(
      page.getByText('Usuario o contraseña incorrectos.'),
    ).toBeVisible();
    await expect(page).toHaveURL(/\/login/);
  });

  test('credenciales válidas navegan al dashboard con la sesión activa', async ({
    page,
  }) => {
    const username = process.env.E2E_ADMIN_USERNAME!;
    const password = process.env.E2E_ADMIN_PASSWORD!;

    await page.goto('/login');
    await page.getByLabel('Usuario').fill(username);
    await page.getByLabel('Contraseña').fill(password);
    await page.getByRole('button', { name: 'Ingresar' }).click();

    await expect(page).toHaveURL('/dashboard');
    await expect(page.getByRole('heading', { name: /^Hola,/ })).toBeVisible();
  });

  test('ruta protegida sin sesión redirige a /login', async ({ page }) => {
    await page.goto('/asociados');
    await expect(page).toHaveURL(/\/login/);
  });
});
