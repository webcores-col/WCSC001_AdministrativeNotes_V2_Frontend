'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useSession } from 'next-auth/react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { DeleteCatalogEntryButton } from '@/components/domain/catalogs/DeleteCatalogEntryButton';
import { EmptyState } from '@/components/shared/EmptyState';
import { ErrorState } from '@/components/shared/ErrorState';
import { LoadingState } from '@/components/shared/LoadingState';
import { TableCard } from '@/components/shared/TableCard';
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { getErrorMessage } from '@/lib/api/error-message';
import { hasPermission } from '@/lib/permissions/has-permission';
import type { CatalogHooks } from '@/lib/query/catalogs';
import {
  createCatalogEntrySchema,
  type CreateCatalogEntryInput,
} from '@/lib/zod/catalog-entry.schema';

/** Reutilizado por tipos de identificación y tipos de pagaré (mismo shape código+nombre). */
export function CatalogManager({
  title,
  hooks,
}: {
  title: string;
  hooks: CatalogHooks;
}) {
  const { data: session } = useSession();
  const list = hooks.useList();
  const createMutation = hooks.useCreate();
  const deleteMutation = hooks.useDelete();
  const canManage = hasPermission(session?.user.permissions, 'catalogs:manage');

  const form = useForm<CreateCatalogEntryInput>({
    resolver: zodResolver(createCatalogEntrySchema),
    defaultValues: { code: '', name: '' },
  });

  const onSubmit = form.handleSubmit((values) => {
    createMutation.mutate(values, {
      onSuccess: () => {
        toast.success('Entrada creada.');
        form.reset();
      },
      onError: (error) => toast.error(getErrorMessage(error)),
    });
  });

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-lg font-semibold">{title}</h2>

      {canManage && (
        <Form {...form}>
          <form
            onSubmit={onSubmit}
            className="flex flex-wrap items-end gap-2"
            noValidate
          >
            <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Código</FormLabel>
                  <FormControl>
                    <Input {...field} className="w-32" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre</FormLabel>
                  <FormControl>
                    <Input {...field} className="w-64" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={createMutation.isPending}>
              {createMutation.isPending ? 'Agregando…' : 'Agregar'}
            </Button>
          </form>
        </Form>
      )}

      {list.isLoading && <LoadingState />}

      {list.isError && (
        <ErrorState
          message={getErrorMessage(list.error)}
          onRetry={() => list.refetch()}
        />
      )}

      {list.isSuccess && list.data.length === 0 && (
        <EmptyState
          title="Sin entradas"
          description="Todavía no hay entradas en este catálogo."
        />
      )}

      {list.isSuccess && list.data.length > 0 && (
        <TableCard
          table={
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Código</TableHead>
                  <TableHead>Nombre</TableHead>
                  {canManage && (
                    <TableHead className="text-right">Acciones</TableHead>
                  )}
                </TableRow>
              </TableHeader>
              <TableBody>
                {list.data.map((entry) => (
                  <TableRow key={entry.code}>
                    <TableCell className="font-mono text-xs tabular-nums">
                      {entry.code}
                    </TableCell>
                    <TableCell>{entry.name}</TableCell>
                    {canManage && (
                      <TableCell className="text-right">
                        <DeleteCatalogEntryButton
                          code={entry.code}
                          name={entry.name}
                          deleteMutation={deleteMutation}
                        />
                      </TableCell>
                    )}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          }
        />
      )}
    </div>
  );
}
