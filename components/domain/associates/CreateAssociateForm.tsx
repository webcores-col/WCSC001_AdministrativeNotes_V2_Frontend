'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { AssociateFieldset } from '@/components/domain/associates/AssociateFieldset';
import { FormActions } from '@/components/shared/FormActions';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { applyApiFormError } from '@/lib/api/form-errors';
import { useCreateAssociateMutation } from '@/lib/query/associates';
import {
  createAssociateSchema,
  type CreateAssociateInput,
} from '@/lib/zod/associate.schema';

export function CreateAssociateForm() {
  const router = useRouter();
  const mutation = useCreateAssociateMutation();

  const form = useForm<CreateAssociateInput>({
    resolver: zodResolver(createAssociateSchema),
    // Valida al salir del campo y revalida al corregir (plan §8); en submit
    // fallido react-hook-form enfoca el primer campo con error por defecto.
    mode: 'onTouched',
    defaultValues: {
      numberIdentity: '',
      typeIdentity: '',
      names: '',
      surname1: '',
      surname2: '',
      dateBirth: '',
      status: 'ACTIVE',
    },
  });

  const onSubmit = form.handleSubmit((values) => {
    mutation.mutate(
      { ...values, surname2: values.surname2 || undefined },
      {
        onSuccess: (created) => {
          toast.success('Asociado creado.');
          router.push(`/asociados/${created.numberIdentity}`);
        },
        // §8: el error de negocio que pertenece a un campo va inline en el
        // campo; lo demás cae a toast persistente.
        onError: (error) => {
          applyApiFormError(error, form, {
            ASSOCIATE_ALREADY_EXISTS: 'numberIdentity',
            ASSOCIATE_IDENTITY_TYPE_INVALID: 'typeIdentity',
          });
        },
      },
    );
  });

  return (
    <Form {...form}>
      <form onSubmit={onSubmit} className="flex flex-col gap-6" noValidate>
        <AssociateFieldset
          control={form.control}
          identificationExtra={
            <FormField
              control={form.control}
              name="numberIdentity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Número de identificación</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          }
        />
        <FormActions>
          <Button
            type="button"
            variant="ghost"
            onClick={() => router.back()}
            disabled={mutation.isPending}
          >
            Cancelar
          </Button>
          <Button type="submit" loading={mutation.isPending}>
            Crear asociado
          </Button>
        </FormActions>
      </form>
    </Form>
  );
}
