'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { AssociateFieldset } from '@/components/domain/associates/AssociateFieldset';
import { FormActions } from '@/components/shared/FormActions';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { getSurname2 } from '@/lib/api/associate-utils';
import { applyApiFormError } from '@/lib/api/form-errors';
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
        onSuccess: () => toast.success('Cambios guardados.'),
        onError: (error) => {
          applyApiFormError(error, form, {
            ASSOCIATE_IDENTITY_TYPE_INVALID: 'typeIdentity',
          });
        },
      },
    );
  });

  return (
    <Form {...form}>
      <form onSubmit={onSubmit} className="flex flex-col gap-6" noValidate>
        <AssociateFieldset control={form.control} />
        <FormActions>
          <Button type="submit" loading={mutation.isPending}>
            Guardar cambios
          </Button>
        </FormActions>
      </form>
    </Form>
  );
}
