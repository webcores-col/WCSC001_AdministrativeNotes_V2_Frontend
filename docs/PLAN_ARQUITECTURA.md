# Plan de arquitectura y construcción

Roadmap por fases del frontend, cada una en su propio commit. Ver
[ADR-001](adr/ADR-001-frontend-bff-nextjs.md) para el porqué de Next.js App
Router como BFF. Consume el contrato real de
[`WCSC001_AdministrativeNotes_V2`](https://github.com/webcores-col/WCSC001_AdministrativeNotes_V2)
(backend en producción); los módulos funcionales (Asociados, Pagarés,
Catálogos, Usuarios — F1–F19) están descritos en `docs/functional/modulos.md`
de ese repo.

Este documento existe para no perder el hilo entre sesiones — antes de la
Fase 3 el roadmap solo vivía disperso en comentarios de código
(`Fase 3`, `Fase 4`, `Fase 9`, `Fase 11` mencionados en `auth.ts`,
`middleware.ts`/`proxy.ts`, `app/api/v1/[...path]/route.ts`,
`lib/api/server-client.ts`). Mismo espíritu que
`docs/PLAN_NUEVA_VERSION.md` en el backend.

## Fases

| Fase | Contenido | Estado |
|---|---|---|
| 0 | Scaffold Next.js 16 (App Router, TS estricto, Tailwind v4, `output: standalone`) + snapshot OpenAPI congelado desde el backend | ✅ `55a41af` |
| 1 | Design system: Tailwind v4/OKLCH (verde petróleo primario, sin dark mode expuesto), Inter + JetBrains Mono, shadcn/ui sobre Radix; `/api/health` propio; piezas de auth/RBAC adelantadas (`lib/api/envelope.ts`, `lib/auth/{decode-jwt,refresh,session-types}.ts`, `lib/permissions/`, `lib/menu/`) | ✅ `6a8a44a` |
| 2 | Cliente API tipado: tipos generados con `openapi-typescript` (`lib/api/schema.d.ts`, no editar a mano), `lib/api/http.ts` con `unwrapEnvelope` (el envelope real del backend no es el que documenta Swagger), `server-client.ts`/`proxy-client.ts`, Vitest configurado | ✅ `9420608` |
| 3 | Auth/sesión: login NextAuth v5 (Credentials) contra `/auth/login`, refresh de tokens single-flight con margen de 30s, `proxy.ts` (convención Next 16, protege rutas fuera de `/login`), proxy BFF same-origin (`app/api/v1/[...path]/route.ts`), logout revoca en backend | ✅ `1180a29` |
| 4 | AppShell: sidebar + header derivados de `permissions[]` real de la sesión (`lib/menu/menu-definition.ts` + `hasPermission`), `QueryClientProvider` (TanStack Query), componentes compartidos de loading/empty/error | ✅ `06a8656` |
| 5 | Asociados (F5–F8): listado paginado + búsqueda + orden, alta, edición, detalle | ✅ `6349936` |
| — | **Fix real de Fase 3**: el proxy BFF usaba `await auth()` suelto, que en Auth.js v5 no persiste un refresh proactivo en el `Set-Cookie` de la respuesta — cualquier segunda petición autenticada cerca del vencimiento del access token reusaba un refresh token ya rotado y el backend revocaba TODA la sesión (detección de robo). Envuelto con `auth(handler)` (patrón soportado) + ventana de gracia de 10s en el single-flight de `lib/auth/refresh.ts` para peticiones realmente paralelas. Reproducido y verificado con backend+frontend locales (ráfagas de hasta 8 peticiones paralelas). | ✅ `b2c3d6b` |
| 6 | Pagarés (F9–F13): listado + filtro por deudor, alta (selector deudor/codeudores/tipo vía `AssociatePicker`), detalle, eliminación lógica con confirmación. Corrigió dos bugs reales de la capa HTTP con el primer endpoint 204 (`lib/api/http.ts` y el proxy BFF no sabían manejar respuestas sin cuerpo) | ✅ `7fa44da` |
| 7 | **Catálogos (F14–F19)**: tipos de identificación y tipos de pagaré, CRUD simple, mutación solo ADMIN, errores de integridad (409) legibles | ⬅️ **siguiente** |
| 8 | Usuarios + Perfil (F1–F4): alta (ADMIN), listado, reset de contraseña, activar/desactivar, cambio de rol; perfil propio (cambiar mi contraseña) | Pendiente |
| 9 | Dashboard real: contadores + asociados recientes (reemplaza el placeholder de Fase 3) | Pendiente |
| 10 | Testing e2e (Playwright, workflow separado no bloqueante en CI): flujos críticos — login, alta de asociado, alta/eliminación de pagaré, gestión de usuarios | Pendiente |
| 11 | Observabilidad: `@sentry/nextjs`, logging pino, correlación `X-Request-Id` con el backend (el proxy BFF ya lo genera/propaga desde Fase 3) | Pendiente |
| 12 | Despliegue: Dockerfile `standalone`, `docker-compose.prod.yml`, `cd.yml` (mismo patrón GHCR + SSH + VPS que el backend), bloque Caddy + dominio propio (`<app>.cointramin.webcores.co`) | Pendiente |
| 13 | Endurecimiento y cierre: pase de accesibilidad, auditoría de estados carga/vacío/error en todas las vistas, checklist final, tag de versión | Pendiente |

## Convenciones establecidas (Fases 0–3)

- El menú y las acciones de UI se derivan de `permissions[]` de la sesión
  real (respuesta de `/auth/login` y `/auth/me`), nunca de un rol
  hardcodeado — ver `lib/permissions/has-permission.ts`.
- Toda vista de datos maneja explícitamente carga/vacío/error con
  componentes compartidos de `components/shared/` (a crear en Fase 4),
  nunca reimplementados por módulo.
- `lib/api/http.ts` siempre resuelve con `unwrapEnvelope`; la UI programa
  contra `error.code`, nunca contra `error.message`.
- El navegador solo habla con su propio origen (`/api/v1/*`); nunca ve
  `BACKEND_URL` ni los JWT del backend (ADR-001).
- Sin dark mode ni i18n en esta versión (alcance explícito).
- Cada fase: commit propio, verificado con
  `npm run typecheck && npm run lint && npm test && npm run build` en verde.
