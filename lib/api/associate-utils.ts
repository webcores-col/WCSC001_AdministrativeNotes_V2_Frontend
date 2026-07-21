import type { AssociateResponseDto } from './types';

/**
 * `surname2` llega tipado como `Record<string, never> | null` en el
 * contrato generado (`openapi-typescript` sobre un DTO que no declara
 * `type: String` para el campo nullable), aunque en runtime siempre es
 * `string | null`. Centraliza la coerción en vez de repetirla en cada
 * componente que lo muestra.
 */
export function getSurname2(
  associate: Pick<AssociateResponseDto, 'surname2'>,
): string {
  return associate.surname2 == null ? '' : String(associate.surname2);
}

export function associateFullName(
  associate: Pick<AssociateResponseDto, 'names' | 'surname1' | 'surname2'>,
): string {
  return [associate.names, associate.surname1, getSurname2(associate)]
    .filter(Boolean)
    .join(' ');
}
