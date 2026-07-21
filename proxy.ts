import { NextResponse } from 'next/server';
import { auth } from '@/auth';

const PUBLIC_ROUTES = ['/login'];

/**
 * Envolver con `auth()` ejecuta los callbacks `jwt`/`session` en cada
 * navegación protegida — es el punto donde el refresh proactivo (Fase 3,
 * ver auth.ts) mantiene la cookie de sesión fresca sin que el usuario lo
 * note. Las rutas de API (`/api/**`) quedan fuera del matcher: el proxy
 * BFF (`app/api/v1/[...path]/route.ts`) maneja su propia sesión y responde
 * 401 en el envelope del contrato, no con una redirección HTML.
 */
export default auth((req) => {
  const isLoggedIn = !!req.auth && req.auth.error !== 'RefreshTokenError';
  const isPublicRoute = PUBLIC_ROUTES.some((route) =>
    req.nextUrl.pathname.startsWith(route),
  );

  if (!isLoggedIn && !isPublicRoute) {
    const loginUrl = new URL('/login', req.nextUrl.origin);
    loginUrl.searchParams.set('callbackUrl', req.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (isLoggedIn && isPublicRoute) {
    return NextResponse.redirect(new URL('/dashboard', req.nextUrl.origin));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
