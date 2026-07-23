'use client';

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
import { getErrorMessage } from '@/lib/api/error-message';
import { useDeleteNoteMutation } from '@/lib/query/notes';

export function DeleteNoteDialog({
  noteId,
  onDeleted,
}: {
  noteId: number;
  onDeleted?: () => void;
}) {
  const [open, setOpen] = useState(false);
  const mutation = useDeleteNoteMutation();

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button type="button" variant="outline" size="sm">
          <Trash2 className="size-4" aria-hidden="true" />
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
            <DialogTitle>¿Eliminar este pagaré?</DialogTitle>
            <DialogDescription>
              Deja de aparecer en las consultas, pero queda registrado quién lo
              eliminó y cuándo. Puede volver a registrarse la misma combinación
              si hace falta.
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
            disabled={mutation.isPending}
            onClick={() => {
              mutation.mutate(noteId, {
                onSuccess: () => {
                  toast.success('Pagaré eliminado.');
                  setOpen(false);
                  onDeleted?.();
                },
                onError: (error) => {
                  toast.error(getErrorMessage(error));
                },
              });
            }}
          >
            {mutation.isPending ? 'Eliminando…' : 'Eliminar'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
