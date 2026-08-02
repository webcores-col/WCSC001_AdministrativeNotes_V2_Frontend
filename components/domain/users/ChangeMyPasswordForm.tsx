'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
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
import { useChangeMyPasswordMutation } from '@/lib/query/users';
import {
  changeMyPasswordSchema,
  type ChangeMyPasswordInput,
} from '@/lib/zod/user.schema';

export function ChangeMyPasswordForm() {
  const mutation = useChangeMyPasswordMutation();
  const form = useForm<ChangeMyPasswordInput>({
    resolver: zodResolver(changeMyPasswordSchema),
    mode: 'onTouched',
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  const onSubmit = form.handleSubmit((values) => {
    mutation.mutate(
      {
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
      },
      {
        onSuccess: () => {
          toast.success('Contraseña cambiada.');
          form.reset();
        },
        // La contraseña actual incorrecta pertenece a su campo (§8).
        onError: (error) => {
          applyApiFormError(error, form, {
            USER_INVALID_CURRENT_PASSWORD: 'currentPassword',
          });
        },
      },
    );
  });

  return (
    <Form {...form}>
      <form
        onSubmit={onSubmit}
        className="flex max-w-sm flex-col gap-4"
        noValidate
      >
        <FormField
          control={form.control}
          name="currentPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Contraseña actual</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  autoComplete="current-password"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="newPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nueva contraseña</FormLabel>
              <FormControl>
                <Input type="password" autoComplete="new-password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirmar nueva contraseña</FormLabel>
              <FormControl>
                <Input type="password" autoComplete="new-password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" loading={mutation.isPending}>
          Cambiar contraseña
        </Button>
      </form>
    </Form>
  );
}
