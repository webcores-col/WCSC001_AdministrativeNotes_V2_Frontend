interface JwtPayload {
  exp: number;
  [claim: string]: unknown;
}

/**
 * Lee (sin verificar firma) el claim `exp` de un JWT. Verificar la firma es
 * responsabilidad exclusiva del backend; el BFF solo necesita saber cuándo
 * vence el access token para decidir cuándo refrescar. Deliberadamente NO
 * se leen `role`/`permissions` del token: esos vienen del cuerpo documentado
 * de `/auth/login` y `/auth/refresh` (`AuthTokensDto.user`), evitando acoplar
 * el frontend a claims internos del JWT que el contrato público no promete.
 */
export function getTokenExpiryMs(accessToken: string): number {
  const payloadSegment = accessToken.split('.')[1];
  if (!payloadSegment) {
    throw new Error('Token de acceso inválido: falta el segmento de payload.');
  }

  const json = Buffer.from(payloadSegment, 'base64url').toString('utf-8');
  const payload = JSON.parse(json) as JwtPayload;

  if (typeof payload.exp !== 'number') {
    throw new Error('Token de acceso inválido: falta el claim exp.');
  }

  return payload.exp * 1000;
}
