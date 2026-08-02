'use client';

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
import { useSetUserStatusMutation } from '@/lib/query/users';

export function ToggleStatusDialog({
  code,
  username,
  isActive,
}: {
  code: string;
  username: string;
  isActive: boolean;
}) {
  const [open, setOpen] = useState(false);
  const mutation = useSetUserStatusMutation();

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button type="button" variant="outline" size="sm">
          {isActive ? 'Desactivar' : 'Activar'}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            ¿{isActive ? 'Desactivar' : 'Activar'} a {username}?
          </DialogTitle>
          <DialogDescription>
            {isActive
              ? 'No podrá ingresar y sus sesiones activas se cierran de inmediato.'
              : 'Podrá volver a ingresar con su usuario y contraseña.'}
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
            variant={isActive ? 'destructive' : 'default'}
            loading={mutation.isPending}
            onClick={() => {
              mutation.mutate(
                { code, payload: { isActive: !isActive } },
                {
                  onSuccess: () => {
                    toast.success(
                      isActive ? 'Usuario desactivado.' : 'Usuario activado.',
                    );
                    setOpen(false);
                  },
                  onError: (error) => toastApiError(error),
                },
              );
            }}
          >
            {isActive ? 'Desactivar' : 'Activar'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
