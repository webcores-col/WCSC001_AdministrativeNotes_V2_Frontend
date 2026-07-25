/** Error de sistema — trazo destructivo sobre blob neutro (plan §6). */
export function ErrorCloud({ className }: { className?: string }) {
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
        d="M85 10c26-2 56 12 60 36s-10 48-32 58-56 4-72-14S20 48 34 30 59 12 85 10z"
        className="fill-muted"
      />
      <path
        d="M60 78c-8 0-14-6-14-14 0-7 5-12 11-13 1-10 9-17 19-17 8 0 15 5 18 12 1 0 2-1 4-1 8 0 14 7 14 15s-6 14-14 14z"
        strokeWidth="1.6"
        strokeLinejoin="round"
        className="fill-card stroke-destructive"
      />
      <path
        d="M85 50v14"
        strokeWidth="1.8"
        strokeLinecap="round"
        className="stroke-destructive"
      />
      <circle cx="85" cy="70" r="1.6" className="fill-destructive" />
      <path
        d="M40 92l4 4m-4 0l4-4M126 90l4 4m-4 0l4-4"
        strokeWidth="1.4"
        strokeLinecap="round"
        className="stroke-destructive opacity-40"
      />
    </svg>
  );
}
