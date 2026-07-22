/**
 * Ilustraciones suaves del sistema (plan de diseño §6): blob orgánico de
 * fondo + motivo lineal de dos tintas, colores solo vía tokens (clases
 * fill-* y stroke-*), siempre decorativas (`aria-hidden`). Solo se usan
 * en estados sin datos — nunca en headers, cards de datos ni formularios.
 */
export function EmptyDocuments({ className }: { className?: string }) {
  return (
    <svg
      width="170"
      height="120"
      viewBox="0 0 170 120"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <path
        d="M85 8c28 0 58 10 64 34s-8 52-30 62-58 10-76-8S17 52 29 32 57 8 85 8z"
        className="fill-primary-soft"
      />
      <rect
        x="55"
        y="30"
        width="60"
        height="72"
        rx="8"
        strokeWidth="1.6"
        className="fill-card stroke-primary"
      />
      <path
        d="M66 48h38M66 60h38M66 72h24"
        strokeWidth="1.6"
        strokeLinecap="round"
        className="stroke-primary"
      />
      <circle
        cx="112"
        cy="94"
        r="14"
        strokeWidth="1.6"
        className="fill-primary-soft stroke-primary"
      />
      <path
        d="M108 94h8M112 90v8"
        strokeWidth="1.6"
        strokeLinecap="round"
        className="stroke-primary"
      />
      <path
        d="M30 24l4 4m-4 0l4-4M142 20l4 4m-4 0l4-4"
        strokeWidth="1.4"
        strokeLinecap="round"
        className="stroke-primary opacity-40"
      />
      <circle cx="148" cy="72" r="2.4" className="fill-primary opacity-30" />
      <circle cx="24" cy="66" r="2.4" className="fill-primary opacity-30" />
    </svg>
  );
}
