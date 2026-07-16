/** Espejo de `AuthUserDto` (backend real): `role` singular + `permissions[]`. */
export interface SessionUser {
  code: string;
  username: string;
  names: string;
  surnames: string;
  role: string;
  permissions: string[];
}

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
  /** epoch ms, derivado del claim `exp` del access token — ver decode-jwt.ts. */
  accessTokenExpires: number;
}
