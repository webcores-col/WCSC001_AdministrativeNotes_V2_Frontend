'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowRight } from 'lucide-react';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { loginSchema, type LoginInput } from '@/lib/zod/auth.schema';

/**
 * `signIn` con la estrategia Credentials solo expone el `code` de la
 * `CredentialsSignin` lanzada en `authorize()` (ver auth.ts) — nunca el
 * `message` real del backend, para no filtrar detalles del contrato al
 * cliente antes de autenticar.
 *
 * Estilos: este formulario solo vive en la escena ink del login (plan
 * §5.2) — campos con label micro-uppercase dentro del campo, sobre
 * ink-softer.
 */
const ERROR_MESSAGES: Record<string, string> = {
  invalid_credentials: 'Usuario o contraseña incorrectos.',
  rate_limited: 'Demasiados intentos. Espere un minuto e intente de nuevo.',
};
const DEFAULT_ERROR_MESSAGE = 'No se pudo iniciar sesión. Intente de nuevo.';

const fieldWrapperClass =
  'flex flex-col gap-0.5 rounded-xl bg-ink-softer px-3.5 py-2.5 transition-shadow focus-within:ring-[3px] focus-within:ring-ring';
const fieldLabelClass =
  'text-[10px] font-semibold tracking-[0.1em] text-surface-ink-foreground/60 uppercase';
const fieldInputClass =
  'h-6 rounded-none border-0 bg-transparent px-0 text-sm text-surface-ink-foreground shadow-none focus-visible:border-0 focus-visible:ring-0';
const fieldErrorClass =
  'rounded-md bg-destructive/20 px-2.5 py-1.5 text-xs text-destructive-foreground';

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') ?? '/dashboard';
  const [formError, setFormError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const form = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: { username: '', password: '' },
  });

  const onSubmit = form.handleSubmit((values) => {
    setFormError(null);
    startTransition(async () => {
      const result = await signIn('credentials', {
        ...values,
        redirect: false,
      });

      if (result?.error) {
        // `result.error` es siempre el string genérico "CredentialsSignin"
        // (el nombre del tipo de error de Auth.js); el código propio que
        // authorize() lanza (invalid_credentials/rate_limited) viaja en
        // `result.code`, un campo separado — bug real encontrado por el
        // e2e de Fase 10 (el mensaje específico nunca se mostraba).
        setFormError(
          (result.code && ERROR_MESSAGES[result.code]) ?? DEFAULT_ERROR_MESSAGE,
        );
        return;
      }

      router.push(callbackUrl);
      router.refresh();
    });
  });

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-3" noValidate>
      <div className={fieldWrapperClass}>
        <Label htmlFor="username" className={fieldLabelClass}>
          Usuario
        </Label>
        <Input
          id="username"
          autoComplete="username"
          aria-invalid={!!form.formState.errors.username}
          aria-describedby={
            form.formState.errors.username ? 'username-error' : undefined
          }
          className={fieldInputClass}
          {...form.register('username')}
        />
      </div>
      {form.formState.errors.username && (
        <p id="username-error" className={fieldErrorClass}>
          {form.formState.errors.username.message}
        </p>
      )}

      <div className={fieldWrapperClass}>
        <Label htmlFor="password" className={fieldLabelClass}>
          Contraseña
        </Label>
        <Input
          id="password"
          type="password"
          autoComplete="current-password"
          aria-invalid={!!form.formState.errors.password}
          aria-describedby={
            form.formState.errors.password ? 'password-error' : undefined
          }
          className={fieldInputClass}
          {...form.register('password')}
        />
      </div>
      {form.formState.errors.password && (
        <p id="password-error" className={fieldErrorClass}>
          {form.formState.errors.password.message}
        </p>
      )}

      {formError && (
        <p role="alert" className={`${fieldErrorClass} text-sm`}>
          {formError}
        </p>
      )}

      <Button
        type="submit"
        disabled={isPending}
        className="mt-2 h-11 self-center rounded-full bg-card px-8 text-[11px] font-bold tracking-[0.1em] text-ink uppercase shadow-brand transition-transform hover:bg-card/90 motion-safe:active:scale-[0.98]"
      >
        {isPending ? 'Ingresando…' : 'Ingresar'}
        <ArrowRight className="size-3.5 text-primary" aria-hidden="true" />
      </Button>
    </form>
  );
}
