'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useLoginForm } from './use-login-form';

/**
 * Login corporativo premium (plan de diseño §5.2, revisión v3): mismo
 * patrón de formulario que el resto de la app (Form/FormField de shadcn),
 * enlace de "olvidó su contraseña" en la fila del label de Contraseña y
 * checkbox de sesión debajo — sin flujo de recuperación real: el backend
 * no expone un endpoint de reseteo, así que el enlace solo revela un
 * mensaje de contacto a un administrador.
 */
export function LoginForm() {
  const { form, onSubmit, formError, isPending } = useLoginForm();
  const [showForgotHelp, setShowForgotHelp] = useState(false);

  return (
    <Form {...form}>
      <form onSubmit={onSubmit} className="flex flex-col gap-4" noValidate>
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Usuario</FormLabel>
              <FormControl>
                <Input autoComplete="username" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <div className="flex items-center justify-between gap-3">
                <FormLabel>Contraseña</FormLabel>
                <button
                  type="button"
                  onClick={() => setShowForgotHelp((open) => !open)}
                  aria-expanded={showForgotHelp}
                  aria-controls="forgot-password-help"
                  className="shrink-0 text-xs font-medium text-primary underline-offset-4 hover:underline"
                >
                  ¿Olvidó su contraseña?
                </button>
              </div>
              <FormControl>
                <Input
                  type="password"
                  autoComplete="current-password"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {showForgotHelp && (
          <p
            id="forgot-password-help"
            className="rounded-md bg-surface-soft px-3 py-2 text-sm text-muted-foreground"
          >
            Por seguridad, el restablecimiento de contraseña lo hace un
            administrador del sistema. Contacte al suyo para continuar.
          </p>
        )}

        <div className="flex items-center gap-2">
          <Checkbox id="keep-session" />
          <Label
            htmlFor="keep-session"
            className="font-normal text-muted-foreground"
          >
            Mantener sesión iniciada
          </Label>
        </div>

        {formError && (
          <p role="alert" className="text-sm text-destructive">
            {formError}
          </p>
        )}

        <Button type="submit" loading={isPending} className="mt-1 h-10 w-full">
          Ingresar
        </Button>
      </form>
    </Form>
  );
}
