"use client";

import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

/**
 * `message` debe venir de `getErrorMessage`/`error.code` (lib/api/error-message.ts),
 * nunca del `Error.message` crudo — mismo criterio que el resto de la UI.
 */
export function ErrorState({
  message = "Ocurrió un error. Intente de nuevo.",
  onRetry,
}: {
  message?: string;
  onRetry?: () => void;
}) {
  return (
    <div
      role="alert"
      className="flex flex-col items-center justify-center gap-2 rounded-md border border-destructive/30 bg-destructive/5 p-12 text-center"
    >
      <AlertTriangle className="size-8 text-destructive" aria-hidden="true" />
      <p className="text-sm font-medium text-destructive">{message}</p>
      {onRetry && (
        <Button variant="outline" size="sm" onClick={onRetry}>
          Reintentar
        </Button>
      )}
    </div>
  );
}
