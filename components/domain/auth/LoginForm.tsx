"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { loginSchema, type LoginInput } from "@/lib/zod/auth.schema";

/**
 * `signIn` con la estrategia Credentials solo expone el `code` de la
 * `CredentialsSignin` lanzada en `authorize()` (ver auth.ts) — nunca el
 * `message` real del backend, para no filtrar detalles del contrato al
 * cliente antes de autenticar.
 */
const ERROR_MESSAGES: Record<string, string> = {
  invalid_credentials: "Usuario o contraseña incorrectos.",
  rate_limited: "Demasiados intentos. Espere un minuto e intente de nuevo.",
};
const DEFAULT_ERROR_MESSAGE = "No se pudo iniciar sesión. Intente de nuevo.";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") ?? "/dashboard";
  const [formError, setFormError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const form = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: { username: "", password: "" },
  });

  const onSubmit = form.handleSubmit((values) => {
    setFormError(null);
    startTransition(async () => {
      const result = await signIn("credentials", {
        ...values,
        redirect: false,
      });

      if (result?.error) {
        setFormError(ERROR_MESSAGES[result.error] ?? DEFAULT_ERROR_MESSAGE);
        return;
      }

      router.push(callbackUrl);
      router.refresh();
    });
  });

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4" noValidate>
      <div className="flex flex-col gap-2">
        <Label htmlFor="username">Usuario</Label>
        <Input
          id="username"
          autoComplete="username"
          aria-invalid={!!form.formState.errors.username}
          aria-describedby={
            form.formState.errors.username ? "username-error" : undefined
          }
          {...form.register("username")}
        />
        {form.formState.errors.username && (
          <p id="username-error" className="text-sm text-destructive">
            {form.formState.errors.username.message}
          </p>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="password">Contraseña</Label>
        <Input
          id="password"
          type="password"
          autoComplete="current-password"
          aria-invalid={!!form.formState.errors.password}
          aria-describedby={
            form.formState.errors.password ? "password-error" : undefined
          }
          {...form.register("password")}
        />
        {form.formState.errors.password && (
          <p id="password-error" className="text-sm text-destructive">
            {form.formState.errors.password.message}
          </p>
        )}
      </div>

      {formError && (
        <p role="alert" className="text-sm text-destructive">
          {formError}
        </p>
      )}

      <Button type="submit" disabled={isPending}>
        {isPending ? "Ingresando…" : "Ingresar"}
      </Button>
    </form>
  );
}
