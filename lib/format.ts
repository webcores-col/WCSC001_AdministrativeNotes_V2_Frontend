/**
 * Formatos regionales es-CO del sistema de diseño (docs/PLAN_DISENO_UI.md
 * §7): toda moneda, fecha o cédula que se muestre en la UI pasa por aquí —
 * nunca formateo ad-hoc por componente. Los formatters de Intl se crean una
 * sola vez a nivel de módulo (crearlos por render es costoso).
 */

const currencyFormatter = new Intl.NumberFormat('es-CO', {
  style: 'currency',
  currency: 'COP',
  maximumFractionDigits: 0,
});

/** «$ 2.500.000» — montos en COP, sin decimales (así los maneja el negocio). */
export function formatCurrencyCOP(value: number): string {
  return currencyFormatter.format(value);
}

const dateFormatter = new Intl.DateTimeFormat('es-CO', {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
});

/** «12 jun 2026» — fecha corta para chips, tablas y detalle. */
export function formatDateShort(date: Date | string): string {
  return dateFormatter.format(typeof date === 'string' ? new Date(date) : date);
}

/*
 * Un `YYYY-MM-DD` del contrato (la fecha del pagaré, la de nacimiento) es un
 * día de calendario, no un instante: `new Date('2026-03-01')` se parsea como
 * medianoche UTC y al formatearlo en la zona local (Colombia, UTC-5) caería
 * al día anterior. Este formateador fija UTC para que el día mostrado sea
 * exactamente el que envió el backend.
 */
const dateOnlyFormatter = new Intl.DateTimeFormat('es-CO', {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
  timeZone: 'UTC',
});

/** «1 mar 2026» — fechas sin hora (`YYYY-MM-DD`), sin corrimiento de día. */
export function formatDateOnly(value: string): string {
  return dateOnlyFormatter.format(new Date(`${value}T00:00:00Z`));
}

/**
 * «1.045.228.917» — número de identificación agrupado con puntos de miles.
 * Si el valor trae algo que no sean dígitos (formatos raros del legacy) se
 * devuelve tal cual: mejor sin agrupar que corromper el dato.
 */
export function formatNumberIdentity(value: string): string {
  if (!/^\d+$/.test(value)) {
    return value;
  }
  return value.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}
