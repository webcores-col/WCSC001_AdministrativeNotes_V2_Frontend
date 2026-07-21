import { expect, test } from '@playwright/test';

test('crea un usuario, cambia su rol, lo desactiva/reactiva y le resetea la contraseña', async ({
  page,
}) => {
  const code = `E2E${Date.now()}`;
  const username = `e2e${Date.now()}`;

  await page.goto('/usuarios/nuevo');
  await page.getByLabel('Código').fill(code);
  await page.getByLabel('Nombres').fill('E2E');
  await page.getByLabel('Apellidos').fill('Usuario');
  await page.getByLabel('Usuario').fill(username);
  await page.getByLabel('Contraseña').fill('ClaveSegura1');
  // El rol por defecto ya es Operador (defaultValues del formulario).
  await page.getByRole('button', { name: 'Crear usuario' }).click();

  await expect(page).toHaveURL('/usuarios');

  const row = page.getByRole('row').filter({ hasText: username });
  await expect(row).toBeVisible();
  await expect(row.getByText('Activo')).toBeVisible();

  // Cambiar rol (cierra las sesiones del usuario afectado).
  await row.getByRole('button', { name: 'Cambiar rol' }).click();
  await page.getByRole('dialog').getByRole('combobox').click();
  await page.getByRole('option', { name: 'Consulta' }).click();
  await page
    .getByRole('dialog')
    .getByRole('button', { name: 'Confirmar' })
    .click();
  await expect(row.getByText('Consulta')).toBeVisible();

  // Desactivar.
  await row.getByRole('button', { name: 'Desactivar' }).click();
  await page
    .getByRole('dialog')
    .getByRole('button', { name: 'Desactivar' })
    .click();
  await expect(row.getByText('Inactivo')).toBeVisible();

  // Reactivar.
  await row.getByRole('button', { name: 'Activar' }).click();
  await page
    .getByRole('dialog')
    .getByRole('button', { name: 'Activar' })
    .click();
  await expect(row.getByText('Activo')).toBeVisible();

  // Resetear contraseña.
  await row.getByRole('button', { name: 'Restablecer contraseña' }).click();
  await page.getByLabel('Nueva contraseña').fill('NuevaClaveTmp1');
  await page
    .getByRole('dialog')
    .getByRole('button', { name: 'Restablecer' })
    .click();
  await expect(
    page.getByText(`Contraseña de "${username}" restablecida.`),
  ).toBeVisible();
});
