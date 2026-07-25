'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { AssociateFieldset } from '@/components/domain/associates/AssociateFieldset';
import { FormActions } from '@/components/shared/FormActions';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { getSurname2 } from '@/lib/api/associate-utils';
import { getErrorMessage } from '@/lib/api/error-message';
import type { AssociateResponseDto } from '@/lib/api/types';
import { useUpdateAssociateMutation } from '@/lib/query/associates';
import {
  updateAssociateSchema,
  type UpdateAssociateInput,
} from '@/lib/zod/associate.schema';

export function EditAssociateForm({
  associate,
}: {
  associate: AssociateResponseDto;
}) {
  const mutation = useUpdateAssociateMutation(associate.numberIdentity);

  const form = useForm<UpdateAssociateInput>({
    resolver: zodResolver(updateAssociateSchema),
    mode: 'onTouched',
    defaultValues: {
      typeIdentity: associate.typeIdentity,
      names: associate.names,
      surname1: associate.surname1,
      surname2: getSurname2(associate),
      dateBirth: associate.dateBirth,
      status: associate.status === 'INACTIVE' ? 'INACTIVE' : 'ACTIVE',
    },
  });

  const onSubmit = form.handleSubmit((values) => {
    mutation.mutate(
      { ...values, surname2: values.surname2 || undefined },
      {
        onSuccess: () => toast.success('Asociado actualizado.'),
        onError: (error) => toast.error(getErrorMessage(error)),
      },
    );
  });

  return (
    <Form {...form}>
      <form
        onSubmit={onSubmit}
        className="grid gap-4 sm:grid-cols-2"
        noValidate
      >
        <AssociateFieldset control={form.control} />
        <FormActions>
          <Button type="submit" disabled={mutation.isPending}>
            {mutation.isPending ? 'Guardando…' : 'Guardar cambios'}
          </Button>
        </FormActions>
      </form>
    </Form>
  );
}
