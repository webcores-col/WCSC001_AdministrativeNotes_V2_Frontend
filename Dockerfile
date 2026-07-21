# ---------- Etapa 1: dependencias ----------
FROM node:22-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

# ---------- Etapa 2: build ----------
FROM node:22-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# Los tipos del contrato ya están congelados en openapi/schema.json y
# lib/api/schema.d.ts (versionados) — no hace falta red ni backend acá.
#
# Next.js "hornea" las variables NEXT_PUBLIC_* dentro del bundle en build
# time (cliente Y servidor: instrumentation.ts también las ve fijas desde
# acá, no desde el .env.prod en runtime) — por eso van como ARG, no en
# env_file de docker-compose.prod.yml. El DSN no es secreto (ver README).
ARG NEXT_PUBLIC_SENTRY_DSN
ARG NEXT_PUBLIC_SENTRY_TRACES_SAMPLE_RATE=0.1
ENV NEXT_PUBLIC_SENTRY_DSN=${NEXT_PUBLIC_SENTRY_DSN}
ENV NEXT_PUBLIC_SENTRY_TRACES_SAMPLE_RATE=${NEXT_PUBLIC_SENTRY_TRACES_SAMPLE_RATE}
RUN npm run build

# ---------- Etapa 3: runtime ----------
FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# `output: standalone` (next.config.ts) traza solo los node_modules que el
# server realmente usa e incluye su propio server.js mínimo.
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs
EXPOSE 3001
ENV PORT=3001
ENV HOSTNAME=0.0.0.0

CMD ["node", "server.js"]
