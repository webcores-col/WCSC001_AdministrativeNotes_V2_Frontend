import { describe, expect, it } from 'vitest';
import {
  formatCurrencyCOP,
  formatDateShort,
  formatNumberIdentity,
} from './format';

describe('formatCurrencyCOP', () => {
  it('formatea COP sin decimales con separador de miles es-CO', () => {
    // Intl usa espacio duro (U+00A0) entre el símbolo y la cifra — se
    // normaliza solo para comparar, la UI muestra lo que Intl produzca.
    expect(formatCurrencyCOP(2500000).replace(/ /g, ' ')).toBe('$ 2.500.000');
  });

  it('redondea decimales (el negocio no maneja centavos)', () => {
    expect(formatCurrencyCOP(1999.6).replace(/ /g, ' ')).toBe('$ 2.000');
  });
});

describe('formatDateShort', () => {
  it('produce día, mes corto y año en español', () => {
    // Date local (no ISO-UTC) para que el test no dependa del timezone.
    expect(formatDateShort(new Date(2026, 5, 12))).toMatch(/12.*jun.*2026/i);
  });

  it('acepta strings ISO con hora (como los devuelve el backend)', () => {
    expect(formatDateShort('2026-06-12T15:30:00-05:00')).toMatch(/jun/i);
  });
});

describe('formatNumberIdentity', () => {
  it('agrupa una cédula con puntos de miles', () => {
    expect(formatNumberIdentity('1045228917')).toBe('1.045.228.917');
  });

  it('no toca valores cortos sin grupos completos', () => {
    expect(formatNumberIdentity('512')).toBe('512');
  });

  it('devuelve tal cual un valor con caracteres no numéricos', () => {
    expect(formatNumberIdentity('CE-512884')).toBe('CE-512884');
  });
});
