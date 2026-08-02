import { expect, test } from '@playwright/test';

test('registra un asociado nuevo y lo muestra en su detalle', async ({
  page,
}) => {
  const numberIdentity = `E2E${Date.now()}`;

  await page.goto('/asociados/nuevo');

  await page.getByLabel('Número de identificación').fill(numberIdentity);
  await page.getByLabel('Tipo de identificación').click();
  await page.getByRole('option').first().click();
  await page.getByLabel('Nombres').fill('E2E');
  await page.getByLabel('Primer apellido').fill('Playwright');
  await page.getByLabel('Fecha de nacimiento').fill('1990-01-01');

  await page.getByRole('button', { name: 'Crear asociado' }).click();

  await expect(page).toHaveURL(`/asociados/${numberIdentity}`);
  await expect(page.getByLabel('Nombres')).toHaveValue('E2E');
  await expect(page.getByLabel('Primer apellido')).toHaveValue('Playwright');

  await page.goto('/asociados');
  await page
    .getByPlaceholder('Buscar por nombre, apellido o identificación...')
    .fill(numberIdentity);
  await expect(page.getByRole('link', { name: numberIdentity })).toBeVisible();
});
