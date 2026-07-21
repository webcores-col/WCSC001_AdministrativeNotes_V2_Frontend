# WCSC001 Administrative Notes — Frontend

Frontend oficial (Next.js, patrón BFF) de
[`WCSC001_AdministrativeNotes_V2`](https://github.com/webcores-col/WCSC001_AdministrativeNotes_V2)
para COINTRAMIN: gestión de **asociados**, **pagarés** (notas
administrativas), **catálogos** y **usuarios**. Ver
[ADR-001](docs/adr/ADR-001-frontend-bff-nextjs.md) para el porqué de la
arquitectura BFF.

## Stack

| Capa               | Tecnología                                                                               |
| ------------------ | ---------------------------------------------------------------------------------------- |
| Runtime            | Node.js 22 (imagen Docker) / ≥20.9 local · TypeScript 5 estricto                         |
| Framework          | Next.js 16 (App Router) + React 19                                                       |
| Estilos            | Tailwind CSS v4 + shadcn/ui (Radix UI)                                                   |
| Estado de servidor | TanStack Query v5                                                                        |
| Formularios        | react-hook-form + zod                                                                    |
| Sesión/Auth        | Auth.js v5 (Credentials) + proxy BFF propio                                              |
| Tipado del API     | openapi-typescript sobre `openapi/schema.json` + cliente HTTP propio (`lib/api/http.ts`) |
| Testing            | Vitest + React Testing Library + MSW (unit/componentes/integración) · Playwright (e2e)   |
| Observabilidad     | @sentry/nextjs · pino                                                                    |

## Inicio rápido (desarrollo)

Requiere el backend V2 corriendo localmente (ver su propio README).

```bash
# 1. Variables de entorno
cp .env.example .env.local
npx auth secret               # completa AUTH_SECRET en .env.local

# 2. Dependencias
npm ci

# 3. Tipos generados desde el snapshot del contrato (sin red, sin backend)
npm run generate:api-types

# 4. Levantar en modo watch
npm run dev                   # http://localhost:3001
```

## Scripts

| Script                          | Descripción                                                 |
| ------------------------------- | ----------------------------------------------------------- |
| `npm run dev`                   | Servidor de desarrollo                                      |
| `npm run lint` / `format:check` | ESLint / Prettier (verificar)                               |
| `npm run typecheck`             | `tsc --noEmit`                                              |
| `npm test`                      | Vitest (unit + componentes + integración MSW)               |
| `npm run test:e2e`              | Playwright (workflow separado, no bloqueante en CI)         |
| `npm run build`                 | Build de producción (`output: standalone`)                  |
| `npm run generate:api-types`    | Regenerar tipos desde `openapi/schema.json`                 |
| `npm run fetch:api-schema`      | Actualizar `openapi/schema.json` desde un backend corriendo |

## Testing e2e (Playwright)

Cubre los flujos críticos con el backend real: login, alta de asociado,
alta/filtro/eliminación de pagaré, gestión de usuarios (`tests/e2e/`).

```bash
# 1. Instalar el navegador (una sola vez; en Linux puede pedir sudo para
#    dependencias del sistema — ver el error de Playwright si falta alguna)
npx playwright install chromium

# 2. Completar en .env.local (además de lo del inicio rápido):
#    E2E_ADMIN_USERNAME / E2E_ADMIN_PASSWORD — el usuario ADMIN semilla
#    del backend local (ver .env.example)

# 3. Con el backend corriendo (el frontend lo levanta Playwright solo):
npm run test:e2e
```

Cada corrida hace 2-3 peticiones reales a `POST /auth/login`. El backend
limita a 5 intentos por minuto por IP — correr la suite completa varias
veces seguidas en menos de un minuto puede toparse con el rate limiting
real (no es un bug del test, ver el comentario en `tests/e2e/auth.spec.ts`).

`.github/workflows/e2e.yml` la corre en CI (workflow separado, no
bloqueante) construyendo el backend desde su código fuente — necesita el
secret `BACKEND_REPO_PAT` (no configurado todavía, ver comentario en ese
archivo).

## Observabilidad

- **Sentry** (`@sentry/nextjs`): `instrumentation-client.ts` (navegador) e
  `instrumentation.ts` (servidor/edge — `onRequestError` captura
  automáticamente errores de Server Components, Route Handlers, Server
  Actions y el proxy). Sin `NEXT_PUBLIC_SENTRY_DSN` el SDK no se
  inicializa (no-op en desarrollo/tests). El DSN no es secreto — igual
  termina expuesto en el bundle del navegador — por eso lleva el prefijo
  `NEXT_PUBLIC_`. Subida de source maps opcional (`SENTRY_ORG`/
  `SENTRY_PROJECT`/`SENTRY_AUTH_TOKEN`, ver `.env.example`).
- **pino** (`lib/logging/logger.ts`): JSON a stdout, mismo criterio que el
  backend — en el VPS se lee con `docker logs`. El proxy BFF
  (`app/api/v1/[...path]/route.ts`) loguea cada petición con su
  `X-Request-Id`, y si el backend es inalcanzable (red caída, timeout)
  responde `502 BACKEND_UNREACHABLE` en vez de una página de error de
  Next.js, reportando la excepción a Sentry con ese mismo `traceId` para
  cruzarlo con los logs.

## Contrato del API

Este proyecto consume el contrato real de `WCSC001_AdministrativeNotes_V2`,
congelado en [`openapi/schema.json`](openapi/schema.json). La UI programa
contra `error.code` del envelope de error, nunca contra `message`
(catálogo completo en el `error-codes.md` del backend). Ver
[ADR-001](docs/adr/ADR-001-frontend-bff-nextjs.md) para el manejo de sesión
y refresh de tokens.

Los tipos de los DTOs se generan con `openapi-typescript`
(`lib/api/schema.d.ts`, no editar a mano — regenerar con
`npm run generate:api-types`), reexportados con nombres cortos en
`lib/api/types.ts`. Las respuestas **no** se resuelven con el tipado
automático de un cliente como `openapi-fetch`: el contrato documenta el tipo
del `data` interno, no el envelope completo con el que responde realmente el
backend (el envelope lo aplica un interceptor global, invisible para
Swagger). `lib/api/http.ts` siempre resuelve la respuesta con
`unwrapEnvelope`, la única fuente de verdad sobre éxito/error.

## Documentación

| Documento                                                | Contenido                                     |
| -------------------------------------------------------- | --------------------------------------------- |
| [`docs/PLAN_ARQUITECTURA.md`](docs/PLAN_ARQUITECTURA.md) | Roadmap por fases, qué está hecho y qué falta |
| [`docs/adr/`](docs/adr/)                                 | Decisiones de arquitectura                    |

## Estructura

```
app/
  (public)/login/               # login, fuera del shell protegido
  (app)/                        # route group protegido por sesión
    dashboard/ asociados/ pagares/ catalogos/ usuarios/ perfil/
  api/
    auth/[...nextauth]/          # Auth.js
    v1/[...path]/                # proxy BFF hacia el backend
    health/                      # liveness propio

components/
  ui/                            # primitivos shadcn/ui
  layout/ domain/ shared/ providers/

lib/
  api/       # cliente tipado, envelope, mapeo de errores
  auth/      # refresh single-flight, decode-jwt
  permissions/ menu/ query/ hooks/ zod/ logging/ tracing/

openapi/schema.json              # snapshot congelado del contrato real
tests/e2e/                       # Playwright: flujos críticos con el backend real
```

## Convenciones

- Toda vista de datos maneja explícitamente carga/vacío/error con los
  componentes compartidos de `components/shared/` — nunca reimplementados
  por módulo.
- El menú y las acciones de UI se derivan de `permissions[]` (respuesta real
  de `/auth/me`), no de un rol hardcodeado en el cliente.
- Sin dark mode ni i18n en esta versión (alcance explícito).
