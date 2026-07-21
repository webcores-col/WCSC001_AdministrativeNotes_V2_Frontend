'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { AssociatePicker } from '@/components/domain/associates/AssociatePicker';
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
import { getErrorMessage } from '@/lib/api/error-message';
import { useNoteTypesQuery } from '@/lib/query/catalogs';
import { useCreateNoteMutation } from '@/lib/query/notes';
import { createNoteSchema, type CreateNoteInput } from '@/lib/zod/note.schema';

export function CreateNoteForm() {
  const router = useRouter();
  const noteTypes = useNoteTypesQuery();
  const mutation = useCreateNoteMutation();

  const form = useForm<CreateNoteInput>({
    resolver: zodResolver(createNoteSchema),
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
          toast.success('Pagaré registrado.');
          router.push(`/pagares/${created.id}`);
        },
        onError: (error) => {
          toast.error(getErrorMessage(error));
        },
      },
    );
  });

  return (
    <Form {...form}>
      <form
        onSubmit={onSubmit}
        className="flex max-w-md flex-col gap-4"
        noValidate
      >
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

        <Button type="submit" disabled={mutation.isPending}>
          {mutation.isPending ? 'Guardando…' : 'Registrar pagaré'}
        </Button>
      </form>
    </Form>
  );
}
