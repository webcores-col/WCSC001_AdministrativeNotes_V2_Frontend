/** Lupa sin resultados — para vacíos de búsqueda/filtro (plan §6 y §7). */
export function EmptyResults({ className }: { className?: string }) {
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
        d="M88 6c26 4 54 16 58 40s-12 48-34 56-54 6-70-12S18 46 32 28 62 2 88 6z"
        className="fill-primary-soft"
      />
      <circle
        cx="80"
        cy="54"
        r="24"
        strokeWidth="1.6"
        className="fill-card stroke-primary"
      />
      <path
        d="M97 71l16 16"
        strokeWidth="1.6"
        strokeLinecap="round"
        className="stroke-primary"
      />
      <path
        d="M70 50c2-6 8-10 14-9"
        strokeWidth="1.6"
        strokeLinecap="round"
        className="stroke-primary opacity-50"
      />
      <path
        d="M34 28l4 4m-4 0l4-4M138 82l4 4m-4 0l4-4"
        strokeWidth="1.4"
        strokeLinecap="round"
        className="stroke-primary opacity-40"
      />
      <circle cx="132" cy="34" r="2.4" className="fill-primary opacity-30" />
    </svg>
  );
}
