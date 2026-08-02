'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { AssociatePicker } from '@/components/domain/associates/AssociatePicker';
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
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { applyApiFormError } from '@/lib/api/form-errors';
import { useNoteTypesQuery } from '@/lib/query/catalogs';
import { useCreateNoteMutation } from '@/lib/query/notes';
import { createNoteSchema, type CreateNoteInput } from '@/lib/zod/note.schema';

export function CreateNoteForm() {
  const router = useRouter();
  const noteTypes = useNoteTypesQuery();
  const mutation = useCreateNoteMutation();

  const form = useForm<CreateNoteInput>({
    resolver: zodResolver(createNoteSchema),
    mode: 'onTouched',
    defaultValues: {
      associateId: '',
      typeNote: '',
      codeudor1Id: '',
      codeudor2Id: '',
    },
  });

  const onSubmit = form.handleSubmit((values) => {
    mutation.mutate(
      {
        associateId: values.associateId,
        typeNote: values.typeNote,
        codeudor1Id: values.codeudor1Id || undefined,
        codeudor2Id: values.codeudor2Id || undefined,
      },
      {
        onSuccess: (created) => {
          toast.success(`Pagaré Nº ${created.id} creado.`);
          router.push(`/pagares/${created.id}`);
        },
        // §8: errores de negocio con campo dueño → inline; el duplicado y
        // las reglas de codeudores involucran varios campos → error de
        // formulario (root), visible sobre las acciones.
        onError: (error) => {
          applyApiFormError(error, form, {
            NOTE_DUPLICATED: 'root',
            NOTE_DEBTOR_NOT_FOUND: 'associateId',
            NOTE_TYPE_INVALID: 'typeNote',
            NOTE_CODEBTOR_NOT_FOUND: 'root',
            NOTE_CODEBTORS_NOT_DISTINCT: 'root',
          });
        },
      },
    );
  });

  return (
    <Form {...form}>
      <form onSubmit={onSubmit} className="flex flex-col gap-4" noValidate>
        <FormField
          control={form.control}
          name="associateId"
          render={({ field }) => (
            <FormItem>
              <Label htmlFor="associateId-picker">Asociado deudor</Label>
              <AssociatePicker
                id="associateId-picker"
                value={field.value}
                onChange={field.onChange}
              />
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="typeNote"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tipo de pagaré</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Seleccione..." />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {noteTypes.data?.map((type) => (
                    <SelectItem key={type.code} value={type.code}>
                      {type.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="codeudor1Id"
          render={({ field }) => (
            <FormItem>
              <Label htmlFor="codeudor1Id-picker">Codeudor 1 (opcional)</Label>
              <AssociatePicker
                id="codeudor1Id-picker"
                value={field.value}
                onChange={field.onChange}
                placeholder="Sin codeudor 1..."
              />
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="codeudor2Id"
          render={({ field }) => (
            <FormItem>
              <Label htmlFor="codeudor2Id-picker">Codeudor 2 (opcional)</Label>
              <AssociatePicker
                id="codeudor2Id-picker"
                value={field.value}
                onChange={field.onChange}
                placeholder="Sin codeudor 2..."
              />
              <FormMessage />
            </FormItem>
          )}
        />

        {form.formState.errors.root && (
          <p
            role="alert"
            className="rounded-md bg-destructive-soft px-3 py-2 text-sm text-destructive-soft-foreground"
          >
            {form.formState.errors.root.message}
          </p>
        )}

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
            Crear pagaré
          </Button>
        </FormActions>
      </form>
    </Form>
  );
}
