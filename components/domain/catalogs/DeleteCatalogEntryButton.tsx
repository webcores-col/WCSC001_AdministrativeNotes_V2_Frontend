'use client';

import type { UseMutationResult } from '@tanstack/react-query';
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
import { getErrorMessage } from '@/lib/api/error-message';

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
        <DialogHeader>
          <DialogTitle>¿Eliminar &quot;{name}&quot;?</DialogTitle>
          <DialogDescription>
            Si hay asociados o pagarés que usan este código, el sistema rechaza
            la eliminación en vez de dejar datos huérfanos.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="outline">
              Cancelar
            </Button>
          </DialogClose>
          <Button
            type="button"
            variant="destructive"
            disabled={deleteMutation.isPending}
            onClick={() => {
              deleteMutation.mutate(code, {
                onSuccess: () => setOpen(false),
                onError: (error) => toast.error(getErrorMessage(error)),
              });
            }}
          >
            {deleteMutation.isPending ? 'Eliminando…' : 'Eliminar'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
