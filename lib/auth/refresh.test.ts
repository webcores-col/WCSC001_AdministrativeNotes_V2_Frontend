import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { refreshAccessToken } from './refresh';

const originalFetch = global.fetch;

const FAKE_USER = {
  code: 'USR001',
  username: 'jperez',
  names: 'Juan',
  surnames: 'Pérez',
  role: 'OPERATOR',
  permissions: ['notes:read'],
};

function makeFakeJwt(payload: Record<string, unknown>): string {
  const base64url = (obj: unknown) =>
    Buffer.from(JSON.stringify(obj)).toString('base64url');
  return `${base64url({ alg: 'none' })}.${base64url(payload)}.`;
}

function mockRefreshResponse(refreshToken: string) {
  const accessToken = makeFakeJwt({
    exp: Math.floor(Date.now() / 1000) + 900,
  });
  return new Response(
    JSON.stringify({
      data: { accessToken, refreshToken, user: FAKE_USER },
    }),
    { status: 200, headers: { 'Content-Type': 'application/json' } },
  );
}

describe('refreshAccessToken (single-flight)', () => {
  beforeEach(() => {
    process.env.BACKEND_URL = 'http://backend.internal:3000';
  });

  afterEach(() => {
    global.fetch = originalFetch;
    vi.restoreAllMocks();
  });

  it('deduplica N refreshes concurrentes del mismo token en una sola llamada de red', async () => {
    let callCount = 0;
    global.fetch = vi.fn(async () => {
      callCount += 1;
      return mockRefreshResponse('rotated-once');
    }) as typeof fetch;

    const results = await Promise.all([
      refreshAccessToken('same-refresh-token'),
      refreshAccessToken('same-refresh-token'),
      refreshAccessToken('same-refresh-token'),
      refreshAccessToken('same-refresh-token'),
      refreshAccessToken('same-refresh-token'),
    ]);

    expect(callCount).toBe(1);
    for (const result of results) {
      expect(result.refreshToken).toBe('rotated-once');
      expect(result.user).toEqual(FAKE_USER);
    }
  });

  it('no deduplica refreshes de refresh tokens distintos', async () => {
    let callCount = 0;
    global.fetch = vi.fn(
      async (input: RequestInfo | URL, init?: RequestInit) => {
        callCount += 1;
        const body = JSON.parse(String(init?.body)) as { refreshToken: string };
        return mockRefreshResponse(`rotated-${body.refreshToken}`);
      },
    ) as typeof fetch;

    const [a, b] = await Promise.all([
      refreshAccessToken('token-a'),
      refreshAccessToken('token-b'),
    ]);

    expect(callCount).toBe(2);
    expect(a.refreshToken).toBe('rotated-token-a');
    expect(b.refreshToken).toBe('rotated-token-b');
  });

  it('reusa el resultado ya resuelto del mismo token durante la ventana de gracia (peticiones realmente paralelas, no solo solapadas)', async () => {
    let callCount = 0;
    global.fetch = vi.fn(async () => {
      callCount += 1;
      return mockRefreshResponse('rotated-once');
    }) as typeof fetch;

    const first = await refreshAccessToken('token-grace-reuse');
    const second = await refreshAccessToken('token-grace-reuse');

    expect(callCount).toBe(1);
    expect(second).toEqual(first);
  });

  it('tras la ventana de gracia, un refresh nuevo del mismo valor sí dispara una llamada nueva', async () => {
    vi.useFakeTimers();
    let callCount = 0;
    global.fetch = vi.fn(async () => {
      callCount += 1;
      return mockRefreshResponse(`rotated-${callCount}`);
    }) as typeof fetch;

    try {
      await refreshAccessToken('token-grace-expiry');
      await vi.advanceTimersByTimeAsync(10_001);
      await refreshAccessToken('token-grace-expiry');

      expect(callCount).toBe(2);
    } finally {
      vi.useRealTimers();
    }
  });

  it('propaga el error si el backend rechaza el refresh (token robado/vencido)', async () => {
    global.fetch = vi.fn(async () => {
      return new Response(
        JSON.stringify({
          error: {
            code: 'AUTH_INVALID_REFRESH_TOKEN',
            message: 'La sesión no es válida o expiró. Inicie sesión de nuevo.',
            traceId: 'abc',
            timestamp: new Date().toISOString(),
          },
        }),
        { status: 401, headers: { 'Content-Type': 'application/json' } },
      );
    }) as typeof fetch;

    await expect(refreshAccessToken('dead-token')).rejects.toThrow();
  });
});
