import { randomUUID } from "node:crypto";
import { NextResponse, type NextRequest } from "next/server";
import { auth } from "@/auth";
import { refreshAccessToken } from "@/lib/auth/refresh";

/**
 * Proxy same-origin hacia el backend real: el navegador solo habla con su
 * propio origen (`/api/v1/*`), nunca con `BACKEND_URL` ni con los JWT del
 * backend (ver ADR-001). Adjunta `Authorization` del lado servidor y
 * propaga `X-Request-Id` para correlacionar con los logs del backend
 * (Fase 11).
 */
async function handler(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> },
): Promise<NextResponse> {
  const session = await auth();
  if (!session) {
    return unauthorizedEnvelope();
  }

  const { path } = await context.params;
  const targetUrl = buildTargetUrl(path, request.nextUrl.search);
  const requestId = request.headers.get("x-request-id") ?? randomUUID();
  const body = await readBody(request);

  let response = await forward(targetUrl, request.method, session.accessToken, requestId, body);

  if (response.status === 401) {
    // El refresh proactivo del middleware normalmente evita llegar aquí;
    // esto cubre la carrera de que el access token venza entre el
    // middleware y esta petición. No reescribe la cookie de sesión (Auth.js
    // v5 no lo permite de forma soportada desde un Route Handler fuera del
    // flujo de `auth()`) — la próxima navegación la refresca vía middleware.
    try {
      const refreshed = await refreshAccessToken(session.refreshToken);
      response = await forward(targetUrl, request.method, refreshed.accessToken, requestId, body);
    } catch {
      return unauthorizedEnvelope();
    }
  }

  const responseBody = await response.text();
  return new NextResponse(responseBody, {
    status: response.status,
    headers: {
      "Content-Type": response.headers.get("Content-Type") ?? "application/json",
      "X-Request-Id": requestId,
    },
  });
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

async function readBody(request: NextRequest): Promise<string | undefined> {
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

export {
  handler as DELETE,
  handler as GET,
  handler as PATCH,
  handler as POST,
  handler as PUT,
};
