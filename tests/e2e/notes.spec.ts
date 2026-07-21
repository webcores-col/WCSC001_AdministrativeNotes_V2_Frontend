import { expect, test } from '@playwright/test';

test('registra un pagaré, aparece filtrando por deudor, y se puede eliminar', async ({
  page,
}) => {
  const numberIdentity = `E2E${Date.now()}`;
  const fullName = 'E2E Deudor Pagares';
  // El buscador del AssociatePicker tiene debounce (300ms): esperar solo por
  // el nombre puede matchear de forma prematura otro "E2E Deudor Pagares"
  // que haya quedado de una corrida anterior (mismo nombre, distinta
  // identificación) mientras el resultado real todavía está en camino.
  // Exigir también la identificación exacta hace que Playwright reintente
  // hasta que aparezca el resultado correcto, no uno cualquiera con ese nombre.
  const optionPattern = new RegExp(`${fullName}.*\\(${numberIdentity}\\)`);

  // Asociado de prueba para usar como deudor.
  await page.goto('/asociados/nuevo');
  await page.getByLabel('Número de identificación').fill(numberIdentity);
  await page.getByLabel('Tipo de identificación').click();
  await page.getByRole('option').first().click();
  await page.getByLabel('Nombres').fill('E2E Deudor');
  await page.getByLabel('Primer apellido').fill('Pagares');
  await page.getByLabel('Fecha de nacimiento').fill('1990-01-01');
  await page.getByRole('button', { name: 'Registrar asociado' }).click();
  await expect(page).toHaveURL(`/asociados/${numberIdentity}`);

  // Registrar el pagaré.
  await page.goto('/pagares/nuevo');
  await page.getByLabel('Asociado deudor').click();
  await page
    .getByPlaceholder('Nombre, apellido o identificación...')
    .fill(numberIdentity);
  await page.getByRole('button', { name: optionPattern }).click();
  await page.getByLabel('Tipo de pagaré').click();
  await page.getByRole('option').first().click();
  await page.getByRole('button', { name: 'Registrar pagaré' }).click();

  await expect(page).toHaveURL(/\/pagares\/\d+/);
  await expect(page.getByText(numberIdentity)).toBeVisible();

  // Filtrar el listado por ese deudor.
  await page.goto('/pagares');
  await page.getByLabel('Filtrar por deudor').click();
  await page
    .getByPlaceholder('Nombre, apellido o identificación...')
    .fill(numberIdentity);
  await page.getByRole('button', { name: optionPattern }).click();

  const filteredRow = page.getByRole('row').filter({ hasText: fullName });
  await expect(filteredRow).toBeVisible();
  // Confirma que el filtro realmente redujo el listado (no solo que la fila
  // exista de casualidad entre las demás mientras la query aún no refresca —
  // `toHaveCount` reintenta hasta que la respuesta filtrada llega).
  await expect(page.getByRole('row')).toHaveCount(2); // encabezado + 1 dato

  // Eliminar (lógico) y confirmar que desaparece de esa misma vista filtrada.
  await filteredRow.getByRole('button', { name: 'Eliminar' }).click();
  await page
    .getByRole('dialog')
    .getByRole('button', { name: 'Eliminar' })
    .click();
  await expect(page.getByText('No hay pagarés')).toBeVisible();
});
