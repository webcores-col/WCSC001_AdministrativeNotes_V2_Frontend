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

| Documento                | Contenido                  |
| ------------------------ | -------------------------- |
| [`docs/adr/`](docs/adr/) | Decisiones de arquitectura |

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
```

## Convenciones

- Toda vista de datos maneja explícitamente carga/vacío/error con los
  componentes compartidos de `components/shared/` — nunca reimplementados
  por módulo.
- El menú y las acciones de UI se derivan de `permissions[]` (respuesta real
  de `/auth/me`), no de un rol hardcodeado en el cliente.
- Sin dark mode ni i18n en esta versión (alcance explícito).
