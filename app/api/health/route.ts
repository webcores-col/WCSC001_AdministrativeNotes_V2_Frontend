import { NextResponse } from 'next/server';

/**
 * Liveness propio de este proceso Next.js (Docker HEALTHCHECK + monitor
 * UptimeRobot). No verifica el backend: si el backend cae, esta app sigue
 * viva y sirve `ErrorState` (degradación elegante) — ver ADR-001.
 */
export function GET() {
  return NextResponse.json({ status: 'ok' });
}
