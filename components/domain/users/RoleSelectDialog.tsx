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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toastApiError } from '@/lib/api/form-errors';
import { ROLE_LABELS } from '@/lib/permissions/role-labels';
import { useSetUserRoleMutation } from '@/lib/query/users';
import { ROLES } from '@/lib/zod/user.schema';

export function RoleSelectDialog({
  code,
  username,
  role,
}: {
  code: string;
  username: string;
  role: string;
}) {
  const [open, setOpen] = useState(false);
  const [nextRole, setNextRole] = useState(role);
  const mutation = useSetUserRoleMutation();

  return (
    <Dialog
      open={open}
      onOpenChange={(value) => {
        setOpen(value);
        if (value) setNextRole(role);
      }}
    >
      <DialogTrigger asChild>
        <Button type="button" variant="outline" size="sm">
          Cambiar rol
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Cambiar rol de {username}</DialogTitle>
          <DialogDescription>
            Cierra todas sus sesiones activas; el rol nuevo aplica en su próximo
            ingreso.
          </DialogDescription>
        </DialogHeader>
        <Select value={nextRole} onValueChange={setNextRole}>
          <SelectTrigger className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {ROLES.map((value) => (
              <SelectItem key={value} value={value}>
                {ROLE_LABELS[value]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="outline">
              Cancelar
            </Button>
          </DialogClose>
          <Button
            type="button"
            disabled={nextRole === role}
            loading={mutation.isPending}
            onClick={() => {
              mutation.mutate(
                { code, payload: { role: nextRole } },
                {
                  onSuccess: () => {
                    toast.success('Rol cambiado.');
                    setOpen(false);
                  },
                  onError: (error) => toastApiError(error),
                },
              );
            }}
          >
            Confirmar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
