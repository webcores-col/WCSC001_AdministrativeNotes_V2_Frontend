'use client';

import { Plus } from 'lucide-react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { associateFullName } from '@/lib/api/associate-utils';
import { getErrorMessage } from '@/lib/api/error-message';
import {
  useListUrlState,
  useUrlSearchInput,
} from '@/lib/hooks/use-list-url-state';
import { hasPermission } from '@/lib/permissions/has-permission';
import { useAssociatesQuery } from '@/lib/query/associates';

const PAGE_SIZE = 20;

const SORT_OPTIONS = [
  { value: 'updatedAt:desc', label: 'Actualizado (recientes primero)' },
  { value: 'updatedAt:asc', label: 'Actualizado (antiguos primero)' },
  { value: 'names:asc', label: 'Nombre (A-Z)' },
  { value: 'names:desc', label: 'Nombre (Z-A)' },
  { value: 'numberIdentity:asc', label: 'Identificación (ascendente)' },
  { value: 'numberIdentity:desc', label: 'Identificación (descendente)' },
] as const;

/*
 * La identificación se muestra sin agrupar (cruda): los e2e la buscan por
 * texto/rol con el valor exacto (getByRole('link', { name: numberIdentity })).
 * El formato con puntos (lib/format.ts) queda para dashboard y detalle.
 */
export default function AsociadosPage() {
  const { data: session } = useSession();
  // Búsqueda, orden y página viven en la URL (§8): el atrás del navegador
  // restaura la vista y los enlaces se pueden compartir.
  const { searchParams, setParams, page, setPage } = useListUrlState();
  const search = searchParams.get('q') ?? '';
  const sort = searchParams.get('sort') ?? 'updatedAt:desc';
  const { input: searchInput, setInput: setSearchInput } = useUrlSearchInput(
    setParams,
    search,
  );

  const query = useAssociatesQuery({ page, size: PAGE_SIZE, search, sort });
  const rows = query.data?.data ?? [];
  const total = query.data?.meta?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const canCreate = hasPermission(
    session?.user.permissions,
    'associates:create',
  );

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Asociados"
        description="Asociados registrados en la cooperativa."
        actions={
          canCreate && (
            <Button asChild>
              <Link href="/asociados/nuevo">
                <Plus aria-hidden="true" />
                Nuevo asociado
              </Link>
            </Button>
          )
        }
      />

      <div className="flex flex-wrap items-center gap-3">
        <Input
          aria-label="Buscar asociados"
          placeholder="Buscar por nombre, apellido o identificación..."
          value={searchInput}
          onChange={(event) => setSearchInput(event.target.value)}
          className="max-w-sm bg-card"
        />
        <Select
          value={sort}
          onValueChange={(value) =>
            setParams({
              sort: value === 'updatedAt:desc' ? undefined : value,
              page: undefined,
            })
          }
        >
          <SelectTrigger aria-label="Ordenar por" className="w-64 bg-card">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {SORT_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
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
          title="No hay asociados"
          illustration={search ? <EmptyResults /> : undefined}
          description={
            search
              ? `Sin resultados para “${search}”. Revise el número o intente con el nombre.`
              : 'Todavía no hay asociados registrados.'
          }
        />
      )}

      {query.isSuccess && rows.length > 0 && (
        <TableCard
          table={
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Identificación</TableHead>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Estado</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((associate) => (
                  <TableRow key={associate.numberIdentity}>
                    <TableCell>
                      <Link
                        href={`/asociados/${associate.numberIdentity}`}
                        className="font-mono text-sm font-medium tabular-nums hover:underline"
                      >
                        {associate.numberIdentity}
                      </Link>
                    </TableCell>
                    <TableCell>
                      <span className="flex items-center gap-2.5">
                        <UserAvatar
                          name={associateFullName(associate)}
                          className="size-7 text-[10px]"
                        />
                        {associateFullName(associate)}
                      </span>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {associate.identityTypeName}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          associate.status === 'ACTIVE'
                            ? 'success'
                            : 'secondary'
                        }
                      >
                        {associate.status === 'ACTIVE' ? 'Activo' : 'Inactivo'}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          }
          cards={rows.map((associate) => (
            <li key={associate.numberIdentity}>
              <Link
                href={`/asociados/${associate.numberIdentity}`}
                className="flex items-center justify-between gap-3 px-4 py-3 transition-colors hover:bg-surface-soft"
              >
                <span className="flex min-w-0 items-center gap-3">
                  <UserAvatar name={associateFullName(associate)} />
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-medium">
                      {associateFullName(associate)}
                    </span>
                    <span className="block font-mono text-xs text-muted-foreground tabular-nums">
                      {associate.numberIdentity} · {associate.identityTypeName}
                    </span>
                  </span>
                </span>
                <Badge
                  variant={
                    associate.status === 'ACTIVE' ? 'success' : 'secondary'
                  }
                >
                  {associate.status === 'ACTIVE' ? 'Activo' : 'Inactivo'}
                </Badge>
              </Link>
            </li>
          ))}
          footer={
            <TablePagination
              page={page}
              totalPages={totalPages}
              total={total}
              noun="asociados"
              onPageChange={setPage}
            />
          }
        />
      )}
    </div>
  );
}
