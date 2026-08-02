'use client';

import type { UseMutationResult } from '@tanstack/react-query';
import { Trash2 } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { toastApiError } from '@/lib/api/form-errors';

export function DeleteCatalogEntryButton({
  code,
  name,
  deleteMutation,
}: {
  code: string;
  name: string;
  deleteMutation: UseMutationResult<void, unknown, string>;
}) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button type="button" variant="outline" size="sm">
          Eliminar
        </Button>
      </DialogTrigger>
      <DialogContent>
        <div className="flex items-start gap-3">
          <span
            aria-hidden="true"
            className="flex size-10 shrink-0 items-center justify-center rounded-md bg-destructive-soft text-destructive-soft-foreground"
          >
            <Trash2 className="size-[18px]" />
          </span>
          <DialogHeader>
            <DialogTitle>¿Eliminar &quot;{name}&quot;?</DialogTitle>
            <DialogDescription>
              Si hay asociados o pagarés que usan este código, el sistema
              rechaza la eliminación en vez de dejar datos huérfanos.
            </DialogDescription>
          </DialogHeader>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="outline">
              Cancelar
            </Button>
          </DialogClose>
          <Button
            type="button"
            variant="destructive"
            loading={deleteMutation.isPending}
            onClick={() => {
              deleteMutation.mutate(code, {
                onSuccess: () => {
                  toast.success('Entrada eliminada.');
                  setOpen(false);
                },
                // El 409 por entradas en uso queda como toast persistente
                // (§8): el error no pertenece a ningún campo y el usuario
                // decide cuándo cerrarlo.
                onError: (error) => toastApiError(error),
              });
            }}
          >
            Eliminar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
