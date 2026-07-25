'use client';

import { Plus } from 'lucide-react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useState } from 'react';
import { ResetPasswordDialog } from '@/components/domain/users/ResetPasswordDialog';
import { RoleSelectDialog } from '@/components/domain/users/RoleSelectDialog';
import { ToggleStatusDialog } from '@/components/domain/users/ToggleStatusDialog';
import { EmptyState } from '@/components/shared/EmptyState';
import { ErrorState } from '@/components/shared/ErrorState';
import { EmptyResults } from '@/components/shared/illustrations/EmptyResults';
import { LoadingState } from '@/components/shared/LoadingState';
import { PageHeader } from '@/components/shared/PageHeader';
import { TableCard } from '@/components/shared/TableCard';
import { TablePagination } from '@/components/shared/TablePagination';
import { UserAvatar } from '@/components/shared/UserAvatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
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
import { useDebouncedValue } from '@/lib/hooks/use-debounced-value';
import { hasPermission } from '@/lib/permissions/has-permission';
import { ROLE_LABELS } from '@/lib/permissions/role-labels';
import { useUsersQuery } from '@/lib/query/users';

const PAGE_SIZE = 20;

export default function UsuariosPage() {
  const { data: session } = useSession();
  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState('');
  const search = useDebouncedValue(searchInput, 300);

  const query = useUsersQuery({ page, size: PAGE_SIZE, search });
  const rows = query.data?.data ?? [];
  const total = query.data?.meta?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const canCreate = hasPermission(session?.user.permissions, 'users:create');
  const canManage = hasPermission(session?.user.permissions, 'users:update');

  const userActions = (user: (typeof rows)[number]) => {
    const isSelf = user.code === session?.user.code;
    return (
      <div className="flex justify-end gap-2">
        {!isSelf && (
          <>
            <RoleSelectDialog
              code={user.code}
              username={user.username}
              role={user.role}
            />
            <ToggleStatusDialog
              code={user.code}
              username={user.username}
              isActive={user.isActive}
            />
          </>
        )}
        <ResetPasswordDialog code={user.code} username={user.username} />
      </div>
    );
  };

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Usuarios"
        description="Cuentas con acceso al sistema y sus roles."
        actions={
          canCreate && (
            <Button asChild>
              <Link href="/usuarios/nuevo">
                <Plus aria-hidden="true" />
                Nuevo usuario
              </Link>
            </Button>
          )
        }
      />

      <div className="flex flex-wrap items-center gap-3">
        <Input
          placeholder="Buscar por nombre, apellido o usuario..."
          value={searchInput}
          onChange={(event) => {
            setPage(1);
            setSearchInput(event.target.value);
          }}
          className="max-w-sm bg-card"
        />
        {query.isSuccess && (
          <span className="ml-auto text-xs text-muted-foreground tabular-nums">
            {total} resultados
          </span>
        )}
      </div>

      {query.isLoading && <LoadingState />}

      {query.isError && (
        <ErrorState
          message={getErrorMessage(query.error)}
          onRetry={() => query.refetch()}
        />
      )}

      {query.isSuccess && rows.length === 0 && (
        <EmptyState
          title="No hay usuarios"
          illustration={search ? <EmptyResults /> : undefined}
          description={
            search
              ? `Sin resultados para “${search}”.`
              : 'Todavía no hay usuarios registrados.'
          }
        />
      )}

      {query.isSuccess && rows.length > 0 && (
        <TableCard
          table={
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Código</TableHead>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Usuario</TableHead>
                  <TableHead>Rol</TableHead>
                  <TableHead>Estado</TableHead>
                  {canManage && (
                    <TableHead className="text-right">Acciones</TableHead>
                  )}
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((user) => (
                  <TableRow key={user.code}>
                    <TableCell className="font-mono text-xs tabular-nums">
                      {user.code}
                    </TableCell>
                    <TableCell>
                      <span className="flex items-center gap-2.5">
                        <UserAvatar
                          name={`${user.names} ${user.surnames}`}
                          className="size-7 text-[10px]"
                        />
                        {user.names} {user.surnames}
                      </span>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {user.username}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {ROLE_LABELS[user.role] ?? user.role}
                    </TableCell>
                    <TableCell>
                      <Badge variant={user.isActive ? 'success' : 'secondary'}>
                        {user.isActive ? 'Activo' : 'Inactivo'}
                      </Badge>
                    </TableCell>
                    {canManage && <TableCell>{userActions(user)}</TableCell>}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          }
          cards={rows.map((user) => (
            <li key={user.code} className="flex flex-col gap-2.5 px-4 py-3">
              <div className="flex items-center justify-between gap-3">
                <span className="flex min-w-0 items-center gap-3">
                  <UserAvatar name={`${user.names} ${user.surnames}`} />
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-medium">
                      {user.names} {user.surnames}
                    </span>
                    <span className="block truncate text-xs text-muted-foreground">
                      {user.username} · {ROLE_LABELS[user.role] ?? user.role}
                    </span>
                  </span>
                </span>
                <Badge variant={user.isActive ? 'success' : 'secondary'}>
                  {user.isActive ? 'Activo' : 'Inactivo'}
                </Badge>
              </div>
              {canManage && userActions(user)}
            </li>
          ))}
          footer={
            <TablePagination
              page={page}
              totalPages={totalPages}
              total={total}
              noun="usuarios"
              onPrevious={() => setPage((current) => current - 1)}
              onNext={() => setPage((current) => current + 1)}
            />
          }
        />
      )}
    </div>
  );
}
