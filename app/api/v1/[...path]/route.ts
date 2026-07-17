import { randomUUID } from "node:crypto";
import type { NextAuthRequest } from "next-auth";
import { NextResponse } from "next/server";
import { auth } from "@/auth";

/**
 * Proxy same-origin hacia el backend real: el navegador solo habla con su
 * propio origen (`/api/v1/*`), nunca con `BACKEND_URL` ni con los JWT del
 * backend (ver ADR-001). Adjunta `Authorization` del lado servidor y
 * propaga `X-Request-Id` para correlacionar con los logs del backend.
 *
 * Envuelto con `auth(handler)` (no `await auth()` suelto) a propósito: es
 * la única forma soportada por Auth.js v5 de persistir en el `Set-Cookie`
 * de la respuesta un refresh proactivo hecho por el callback `jwt` (ver
 * auth.ts) cuando se dispara desde un Route Handler — con `await auth()`
 * suelto el refresh pasa igual (rota el token en el backend) pero la
 * cookie del cliente se queda con el refresh token viejo, ya consumido; la
 * siguiente petición que también necesite refrescar lo reusa y el backend
 * lo trata como robo de sesión, revocando TODAS las sesiones del usuario.
 * Bug real reproducido en el smoke test de Fase 5 (dos peticiones seguidas
 * al proxy cerca del vencimiento del access token bastan) y corregido
 * aquí — por eso ya no hace falta el reintento manual con
 * `refreshAccessToken` que había antes: el refresh proactivo ya persiste
 * correctamente.
 */
async function handler(
  request: NextAuthRequest,
  context: { params: Promise<{ path: string[] }> },
): Promise<NextResponse> {
  const session = request.auth;
  if (!session || session.error === "RefreshTokenError") {
    return unauthorizedEnvelope();
  }

  const { path } = await context.params;
  const targetUrl = buildTargetUrl(path, request.nextUrl.search);
  const requestId = request.headers.get("x-request-id") ?? randomUUID();
  const body = await readBody(request);

  const response = await forward(
    targetUrl,
    request.method,
    session.accessToken,
    requestId,
    body,
  );

  const responseInit = {
    status: response.status,
    headers: {
      "Content-Type": response.headers.get("Content-Type") ?? "application/json",
      "X-Request-Id": requestId,
    },
  };

  // 204 (p. ej. DELETE /notes/:id) no admite body en la Response, ni
  // siquiera vacío — el constructor lanza "Invalid response status code
  // 204" si se le pasa uno. Bug real encontrado en el smoke test de
  // Fase 6 (la eliminación de pagarés fue el primer endpoint 204 que
  // pasó por este proxy).
  if (response.status === 204) {
    return new NextResponse(null, responseInit);
  }

  const responseBody = await response.text();
  return new NextResponse(responseBody, responseInit);
}

async function forward(
  url: string,
  method: string,
  accessToken: string,
  requestId: string,
  body: string | undefined,
): Promise<Response> {
  return fetch(url, {
    method,
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
      "X-Request-Id": requestId,
    },
    body,
    cache: "no-store",
  });
}

async function readBody(
  request: NextAuthRequest,
): Promise<string | undefined> {
  if (request.method === "GET" || request.method === "HEAD") return undefined;
  const text = await request.text();
  return text.length > 0 ? text : undefined;
}

function buildTargetUrl(path: string[], search: string): string {
  return `${process.env.BACKEND_URL}/api/v1/${path.join("/")}${search}`;
}

function unauthorizedEnvelope(): NextResponse {
  return NextResponse.json(
    {
      error: {
        code: "UNAUTHORIZED",
        message: "No autenticado o token inválido/expirado.",
        traceId: randomUUID(),
        timestamp: new Date().toISOString(),
      },
    },
    { status: 401 },
  );
}

const wrappedHandler = auth(handler);

export {
  wrappedHandler as DELETE,
  wrappedHandler as GET,
  wrappedHandler as PATCH,
  wrappedHandler as POST,
  wrappedHandler as PUT,
};
