import path from 'node:path';
import { expect, test as setup } from '@playwright/test';

const authFile = path.join(__dirname, '.auth/admin.json');

setup('autenticar como ADMIN', async ({ page }) => {
  const username = process.env.E2E_ADMIN_USERNAME;
  const password = process.env.E2E_ADMIN_PASSWORD;
  if (!username || !password) {
    throw new Error(
      'Faltan E2E_ADMIN_USERNAME/E2E_ADMIN_PASSWORD en .env.local (ver .env.example) — son las credenciales del usuario ADMIN semilla del backend.',
    );
  }

  await page.goto('/login');
  await page.getByLabel('Usuario').fill(username);
  await page.getByLabel('Contraseña').fill(password);
  await page.getByRole('button', { name: 'Ingresar' }).click();

  await expect(page).toHaveURL('/dashboard');
  await page.context().storageState({ path: authFile });
});
