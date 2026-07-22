'use client';

import { ErrorCloud } from '@/components/shared/illustrations/ErrorCloud';
import { Button } from '@/components/ui/button';

/**
 * `message` debe venir de `getErrorMessage`/`error.code` (lib/api/error-message.ts),
 * nunca del `Error.message` crudo — mismo criterio que el resto de la UI.
 */
export function ErrorState({
  message = 'Ocurrió un error. Intente de nuevo.',
  onRetry,
}: {
  message?: string;
  onRetry?: () => void;
}) {
  return (
    <div
      role="alert"
      className="flex flex-col items-center justify-center gap-3 rounded-xl border border-destructive/30 bg-card px-6 py-14 text-center"
    >
      <ErrorCloud />
      <p className="mx-auto max-w-[44ch] text-sm font-semibold text-destructive-soft-foreground">
        {message}
      </p>
      {onRetry && (
        <Button variant="outline" size="sm" onClick={onRetry}>
          Reintentar
        </Button>
      )}
    </div>
  );
}
