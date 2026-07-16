/**
 * Actualiza `openapi/schema.json` desde un backend corriendo (por defecto
 * `http://localhost:3000`, o `BACKEND_URL`). El JSON crudo del contrato lo
 * expone Swagger en `/docs-json` (ver `src/main.ts` del backend) — sin
 * prefijo `/api/v1` porque el `SwaggerModule.setup()` corre sobre `app`
 * directo, antes del prefijo global de versión.
 *
 * El snapshot resultante se commitea: es la fuente de tipos del build
 * (`npm run generate:api-types`), que no depende de red ni de tener el
 * backend corriendo.
 */
import { writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

async function main(): Promise<void> {
  const backendUrl = process.env.BACKEND_URL ?? 'http://localhost:3000';
  const url = `${backendUrl}/docs-json`;

  console.log(`Descargando contrato OpenAPI desde ${url} ...`);
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(
      `No se pudo obtener el contrato (${response.status} ${response.statusText}). ` +
        `¿Está el backend corriendo en ${backendUrl}?`,
    );
  }

  const document = await response.json();
  const outPath = resolve(process.cwd(), 'openapi/schema.json');
  writeFileSync(outPath, JSON.stringify(document, null, 2) + '\n', 'utf-8');
  console.log(`Contrato guardado en ${outPath}`);
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
