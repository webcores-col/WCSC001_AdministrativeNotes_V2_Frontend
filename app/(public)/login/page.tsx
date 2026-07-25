import { Suspense } from 'react';
import { LoginForm } from '@/components/domain/auth/LoginForm';

/**
 * Escena de marca del login (plan de diseño §5.2): la única pantalla oscura
 * de la v1. Fondo ink con formas orgánicas decorativas y card-documento con
 * troquel superior — la firma del talonario (§3). Usa la familia de tokens
 * ink directamente, sin activar `.dark`.
 */
export default function LoginPage() {
  return (
    <main className="relative flex min-h-screen flex-1 flex-col items-center justify-center gap-7 overflow-hidden bg-ink p-6">
      {/* Formas orgánicas y puntos decorativos, mismos motivos que las ilustraciones (§6). */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-40 -right-24 size-[420px] rounded-[44%_56%_60%_40%/50%_44%_56%_50%] bg-ink-soft"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-32 -left-20 size-[300px] rounded-[55%_45%_40%_60%/45%_55%_45%_55%] bg-ink-soft"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-[14%] bottom-10 size-[120px] rounded-[50%_50%_45%_55%/55%_45%_55%_45%] bg-ink-softer opacity-50"
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute top-[18%] left-[10%] size-1.5 rounded-full bg-surface-ink-foreground/20"
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute top-[26%] right-[12%] size-1.5 rounded-full bg-surface-ink-foreground/20"
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute bottom-[22%] left-[18%] size-1.5 rounded-full bg-surface-ink-foreground/20"
      />

      <h1 className="relative text-xl font-bold tracking-tight text-surface-ink-foreground">
        Pagarés <span className="text-primary-soft">·</span> COINTRAMIN
      </h1>

      <div className="relative w-full max-w-sm rounded-2xl border-t border-dashed border-surface-ink-foreground/25 bg-ink-soft p-6 pt-5 shadow-lg">
        <p className="mb-4 text-[10px] font-semibold tracking-[0.12em] text-surface-ink-foreground/60 uppercase">
          Acceso · Pagarés
        </p>
        <Suspense>
          <LoginForm />
        </Suspense>
      </div>

      <p className="relative text-xs text-surface-ink-foreground/50">
        Gestión de asociados y pagarés de COINTRAMIN.
      </p>
    </main>
  );
}
