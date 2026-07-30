'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { loginSchema, type LoginInput } from '@/lib/zod/auth.schema';

/**
 * `signIn` con la estrategia Credentials solo expone el `code` de la
 * `CredentialsSignin` lanzada en `authorize()` (ver auth.ts) — nunca el
 * `message` real del backend, para no filtrar detalles del contrato al
 * cliente antes de autenticar.
 */
const ERROR_MESSAGES: Record<string, string> = {
  invalid_credentials: 'Usuario o contraseña incorrectos.',
  rate_limited: 'Demasiados intentos. Espere un minuto e intente de nuevo.',
};
const DEFAULT_ERROR_MESSAGE = 'No se pudo iniciar sesión. Intente de nuevo.';

export function useLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') ?? '/dashboard';
  const [formError, setFormError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const form = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: { username: '', password: '' },
    mode: 'onTouched',
  });

  const onSubmit = form.handleSubmit((values) => {
    setFormError(null);
    startTransition(async () => {
      const result = await signIn('credentials', {
        ...values,
        redirect: false,
      });

      if (result?.error) {
        // `result.error` es siempre el string genérico "CredentialsSignin";
        // el código propio que authorize() lanza (invalid_credentials/
        // rate_limited) viaja en `result.code`, un campo separado.
        setFormError(
          (result.code && ERROR_MESSAGES[result.code]) ?? DEFAULT_ERROR_MESSAGE,
        );
        return;
      }

      router.push(callbackUrl);
      router.refresh();
    });
  });

  return { form, onSubmit, formError, isPending };
}
