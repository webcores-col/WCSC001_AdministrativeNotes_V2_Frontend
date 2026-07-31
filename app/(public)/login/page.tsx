import { Suspense } from 'react';
import { LoginForm } from '@/components/domain/auth/LoginForm';

/**
 * Escena de marca del login (plan de diseño §5.2, revisión v3): card
 * blanca flotante sobre una escena pictórica abstracta en la identidad
 * propia del proyecto (verde petróleo + ink, hue 175) — corporativa y
 * moderna sin depender del fondo oscuro ni de las formas orgánicas de la
 * v1. La cinta decorativa se recorta en móvil (breakpoints) para no cubrir
 * toda la pantalla de color sólido.
 */
export default function LoginPage() {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background p-6">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        <div
          className="absolute -top-[18%] -right-[30%] size-[260px] rotate-[18deg] rounded-[50%] blur-[55px] opacity-70 sm:-top-[30%] sm:-right-[15%] sm:size-[900px] sm:blur-[110px] sm:opacity-85"
          style={{
            background:
              'linear-gradient(135deg, var(--ink) 0%, var(--green-600) 38%, var(--green-400) 64%, var(--green-100) 100%)',
          }}
        />
        <div
          className="absolute top-[9%] right-[3%] size-[140px] rotate-[8deg] rounded-[50%] blur-[40px] opacity-60 sm:top-[12%] sm:right-[6%] sm:size-[420px] sm:blur-[90px] sm:opacity-75"
          style={{
            background:
              'radial-gradient(circle, var(--green-300) 0%, transparent 70%)',
          }}
        />
        <div
          className="absolute -bottom-[20%] -left-[10%] hidden size-[520px] rotate-[-12deg] rounded-[50%] opacity-50 blur-[100px] sm:block"
          style={{
            background:
              'linear-gradient(135deg, var(--green-200) 0%, transparent 70%)',
          }}
        />
      </div>

      <div className="relative w-full max-w-sm">
        <div className="mb-6 flex items-center gap-2.5">
          <span
            aria-hidden="true"
            className="flex size-8 shrink-0 items-center justify-center rounded-[10px] bg-primary-soft text-sm font-bold text-primary-soft-foreground"
          >
            C
          </span>
          <span className="text-sm font-semibold tracking-tight">
            COINTRAMIN
          </span>
        </div>

        <div className="rounded-2xl border border-border-subtle bg-card p-8 shadow-lg">
          <h1 className="text-lg font-semibold tracking-tight">
            Iniciar sesión
          </h1>
          <p className="mt-1 mb-6 text-sm text-muted-foreground">
            Ingrese sus credenciales para acceder al sistema.
          </p>
          <Suspense>
            <LoginForm />
          </Suspense>
        </div>
      </div>
    </main>
  );
}
