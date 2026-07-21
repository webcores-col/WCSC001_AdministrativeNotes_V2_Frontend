import NextAuth, { CredentialsSignin, type Session } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { ApiError, unwrapEnvelope } from '@/lib/api/envelope';
import { getTokenExpiryMs } from '@/lib/auth/decode-jwt';
import { refreshAccessToken } from '@/lib/auth/refresh';
import type { SessionUser, TokenPair } from '@/lib/auth/session-types';
import { loginSchema } from '@/lib/zod/auth.schema';

/**
 * Refrescar un poco antes del vencimiento real evita la carrera en la que
 * una petición ve el access token "todavía válido" por unos milisegundos y
 * llega al backend ya vencido.
 */
const REFRESH_MARGIN_MS = 30_000;

/**
 * Errores de credenciales propios: Auth.js v5 solo expone al cliente el
 * `code` de una `CredentialsSignin` (por seguridad, oculta el resto). Se
 * necesitan dos códigos distintos porque la UI debe diferenciar
 * "usuario o contraseña incorrectos" de "demasiados intentos" (ver guía de
 * integración del backend, §1: ambos casos pueden ocurrir en el login).
 */
export class InvalidCredentialsError extends CredentialsSignin {
  code = 'invalid_credentials';
}

export class RateLimitedError extends CredentialsSignin {
  code = 'rate_limited';
}

declare module 'next-auth' {
  interface Session {
    user: SessionUser;
    accessToken: string;
    refreshToken: string;
    accessTokenExpires: number;
    error?: 'RefreshTokenError';
  }

  interface User extends TokenPair {
    user: SessionUser;
  }
}

declare module '@auth/core/jwt' {
  interface JWT {
    accessToken: string;
    refreshToken: string;
    accessTokenExpires: number;
    user: SessionUser;
    error?: 'RefreshTokenError';
  }
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  session: { strategy: 'jwt' },
  pages: { signIn: '/login' },
  providers: [
    Credentials({
      credentials: {
        username: { label: 'Usuario' },
        password: { label: 'Contraseña', type: 'password' },
      },
      authorize: async (rawCredentials) => {
        const parsed = loginSchema.safeParse(rawCredentials);
        if (!parsed.success) {
          throw new InvalidCredentialsError();
        }

        try {
          const response = await fetch(
            `${process.env.BACKEND_URL}/api/v1/auth/login`,
            {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(parsed.data),
            },
          );
          const body: unknown = await response.json().catch(() => undefined);
          const { data } = unwrapEnvelope<{
            accessToken: string;
            refreshToken: string;
            user: SessionUser;
          }>(body, response.status);

          return {
            id: data.user.code,
            accessToken: data.accessToken,
            refreshToken: data.refreshToken,
            accessTokenExpires: getTokenExpiryMs(data.accessToken),
            user: data.user,
          };
        } catch (error) {
          if (error instanceof ApiError && error.code === 'RATE_LIMITED') {
            throw new RateLimitedError();
          }
          throw new InvalidCredentialsError();
        }
      },
    }),
  ],
  callbacks: {
    jwt: async ({ token, user }) => {
      if (user) {
        // Login recién hecho: `user` es lo que devolvió `authorize`.
        return {
          ...token,
          accessToken: user.accessToken,
          refreshToken: user.refreshToken,
          accessTokenExpires: user.accessTokenExpires,
          user: user.user,
          error: undefined,
        };
      }

      if (Date.now() < token.accessTokenExpires - REFRESH_MARGIN_MS) {
        return token;
      }

      try {
        const refreshed = await refreshAccessToken(token.refreshToken);
        return {
          ...token,
          accessToken: refreshed.accessToken,
          refreshToken: refreshed.refreshToken,
          accessTokenExpires: refreshed.accessTokenExpires,
          user: refreshed.user,
          error: undefined,
        };
      } catch {
        // El refresh token ya no sirve (vencido o robo detectado): la
        // sesión queda marcada con error; el middleware la trata como no
        // autenticada y fuerza login de nuevo.
        return { ...token, error: 'RefreshTokenError' };
      }
    },
    session: async ({ session, token }) => {
      // El tipo del parámetro `session` que expone @auth/core intersecta la
      // rama de estrategia "database" (`user: AdapterUser`) con la de "jwt"
      // (la única que usamos aquí, ver `session.strategy` arriba) — por
      // construcción del propio callback, no algo que podamos evitar desde
      // la config. `Session.user` queda tipado como `AdapterUser &
      // SessionUser`, aunque en runtime con estrategia jwt jamás existe un
      // `AdapterUser`. El cast es hacia el `Session` real que augmentamos.
      return {
        ...session,
        user: token.user,
        accessToken: token.accessToken,
        refreshToken: token.refreshToken,
        accessTokenExpires: token.accessTokenExpires,
        error: token.error,
      } as Session;
    },
  },
  events: {
    signOut: async (message) => {
      // Solo aplica a la estrategia JWT (siempre, en este proyecto).
      if (!('token' in message) || !message.token?.refreshToken) return;
      await fetch(`${process.env.BACKEND_URL}/api/v1/auth/logout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${message.token.accessToken}`,
        },
        body: JSON.stringify({ refreshToken: message.token.refreshToken }),
      }).catch(() => {
        // Si el backend no responde, la sesión local igual se cierra; el
        // refresh token queda vivo hasta su propio vencimiento (7 días) o
        // hasta que se use y sea detectado como ya rotado.
      });
    },
  },
});
