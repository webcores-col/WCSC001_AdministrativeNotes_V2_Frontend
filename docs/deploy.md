# Despliegue

Mismo patrón que el backend (`WCSC001_AdministrativeNotes_V2/docs/deploy.md`):
VPS Hetzner compartido de COINTRAMIN, imagen en GHCR, CD por SSH.

```
CI (cada PR):    lint → typecheck → test → build
CD (push a main): imagen → GHCR → SSH al VPS → docker compose up -d → smoke /api/health
```

## Servidor (compartido con el backend y los otros proyectos de COINTRAMIN)

VPS `159.69.251.244`, `/opt/infra` (red Docker `web`, Postgres, Caddy —
compartidos, fuera de este repo). Esta app en `/opt/apps/wcsc001-frontend`:
`docker-compose.prod.yml` (versionado) + `.env.prod` (secretos reales,
`chmod 600`, fuera de git). Sin base de datos propia — es stateless, habla
con el backend por la red Docker interna (`http://wcsc001-api:3000`).

**URL:** `https://notes.cointramin.webcores.co` (DNS en Cloudflare, modo
**DNS only**, mismo criterio que el backend). Certificado Let's Encrypt vía
Caddy.

## GitHub — secrets y variables para activar el CD

**Secrets** (Settings → Secrets and variables → Actions → Secrets):

| Secret               | Valor                                                                 |
| -------------------- | --------------------------------------------------------------------- |
| `VPS_DEPLOY_SSH_KEY` | Contenido de `~/.ssh/cointramin_vps_deploy` (privada, sin passphrase) |

**Variables** (misma pantalla → Variables):

| Variable                                | Valor                                                      |
| --------------------------------------- | ---------------------------------------------------------- |
| `VPS_DEPLOY_ENABLED`                    | `true`                                                     |
| `VPS_HOST`                              | `notes.cointramin.webcores.co`                             |
| `PRODUCTION_URL`                        | `https://notes.cointramin.webcores.co`                     |
| `NEXT_PUBLIC_SENTRY_DSN`                | DSN de Sentry de este frontend (no es secreto, ver README) |
| `NEXT_PUBLIC_SENTRY_TRACES_SAMPLE_RATE` | `0.1`                                                      |

## Bootstrap manual (ya hecho una vez, referencia)

1. `mkdir /opt/apps/wcsc001-frontend` en el VPS.
2. `.env.prod` con `BACKEND_URL=http://wcsc001-api:3000`, `AUTH_SECRET`
   (generar con `openssl rand -base64 32`), `AUTH_URL=https://notes.cointramin.webcores.co`,
   `AUTH_TRUST_HOST=true`, `LOG_LEVEL=info`. `NEXT_PUBLIC_SENTRY_DSN` **no**
   va acá — Next.js lo hornea en build time, no runtime (ver Dockerfile).
3. Copiar el código fuente (o `git clone` si el repo ya está en GitHub) a
   `/opt/apps/wcsc001-frontend`.
4. `docker compose -f docker-compose.prod.yml build --build-arg NEXT_PUBLIC_SENTRY_DSN=... && docker compose -f docker-compose.prod.yml up -d`.
5. Bloque en `/opt/infra/Caddyfile`:
   ```
   notes.cointramin.webcores.co {
   	reverse_proxy wcsc001-frontend:3001
   }
   ```
   luego `docker exec infra-caddy caddy reload --config /etc/caddy/Caddyfile`.
6. Verificar: `curl https://notes.cointramin.webcores.co/api/health` y login
   real desde el navegador.

## Pendiente

- UptimeRobot sobre `/api/health` (mismo criterio que el backend).

## Verificado en producción

CD activado y probado de punta a punta (`workflow_dispatch`): build → GHCR →
SSH deploy → smoke test, los 3 jobs en verde, contenedor recreado con la
imagen publicada (no la construida a mano). Login real contra
`https://notes.cointramin.webcores.co` con el usuario admin sembrado en el
backend de producción (`SEED_ADMIN_PASSWORD` de su propio `.env.prod`, no el
de desarrollo local — son credenciales distintas): sesión con permisos
ADMIN completos, `/dashboard` autenticado y proxy BFF a `/api/v1/*`
respondiendo 200.
