# ADR-001: Arquitectura frontend — Next.js (App Router) como BFF

**Fecha:** 2026-07-16 · **Estado:** Aceptada

## Contexto

`WCSC001_AdministrativeNotes_V2` (backend NestJS + Prisma) está en producción
en `https://notes-api.cointramin.webcores.co`. Este proyecto es su frontend
oficial. Existen otros proyectos en la carpeta de trabajo
(`WCS001_AdministrativeAssociate_MS`, `WCS002_AdministrativeAssociate_App`)
que son **laboratorios no oficiales** del mismo cliente sobre una versión
anterior del contrato — no son fuente de arquitectura, diseño ni paleta para
este proyecto. Las únicas fuentes de verdad son el contrato real del backend
V2 (`openapi/schema.json`, `docs/error-codes.md` y la guía de integración del
propio backend) y la infraestructura ya en producción (VPS Hetzner
compartido, `/opt/infra`).

## Decisión

Usar **Next.js 16 (App Router) como Backend-for-Frontend (BFF)** con sesión
server-side, en vez de una SPA estática (Vite + React Router) servida
directamente por Caddy.

## Justificación

1. **El modelo de tokens del backend lo exige.** El refresh token de V2 es de
   un solo uso con detección de robo: reusar uno ya rotado revoca _todas_ las
   sesiones del usuario (ver guía de integración del backend, §3). Si los
   tokens vivieran en el navegador (patrón SPA clásico), dos pestañas
   refrescando a la vez se auto-expulsarían entre sí — coordinar eso
   cross-tab (Web Locks/BroadcastChannel) es frágil y no cubre recargas
   concurrentes de múltiples orígenes. Con el token custodiado **en el
   servidor** (cookie de sesión cifrada `httpOnly`), un único punto controla
   el refresh y puede serializarlo con un lock en proceso (patrón
   _single-flight_, ver `lib/auth/refresh.ts`). Además, OWASP desaconseja
   almacenar refresh tokens en storage del navegador por exposición a XSS.
2. **Es el estándar de mercado dominante para aplicaciones administrativas
   React en 2026**: SSR para primera pintura rápida, streaming, y salida
   `standalone` que produce imágenes Docker pequeñas — encaja con el patrón
   de despliegue por contenedor que ya es el estándar oficial (el del
   backend: GHCR + SSH + `docker compose` sobre el VPS compartido).

**Alternativa evaluada y descartada:** SPA estática servida por Caddy —
operativamente más simple (sin proceso Node en el servidor), pero obliga a
poner el refresh token en el navegador, chocando de frente con el punto 1.
La seguridad del modelo de tokens pesa más que la simplicidad operativa.

## Consecuencias

- El servidor Next.js corre como proceso Node propio en el VPS (contenedor
  Docker adicional en la red `web`), no un simple `file_server` estático de
  Caddy — mismo patrón operativo que el backend, ya probado.
- La comunicación BFF→backend usa la red Docker interna
  (`http://wcsc001-api:3000`), sin salir a Internet ni pasar por Caddy.
- El lock de refresh es por proceso: correcto con una réplica (caso actual);
  escalar horizontalmente requeriría un store compartido (no existe hoy,
  documentado como riesgo conocido, no bloqueante).
