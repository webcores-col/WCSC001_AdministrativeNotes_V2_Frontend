'use client';

import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { useState } from 'react';
import { EmptyState } from '@/components/shared/EmptyState';
import { ErrorState } from '@/components/shared/ErrorState';
import { LoadingState } from '@/components/shared/LoadingState';
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
import { useDebouncedValue } from '@/lib/hooks/use-debounced-value';
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

export default function AsociadosPage() {
  const { data: session } = useSession();
  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState('');
  const [sort, setSort] = useState<string>('updatedAt:desc');
  const search = useDebouncedValue(searchInput, 300);

  const query = useAssociatesQuery({ page, size: PAGE_SIZE, search, sort });
  const rows = query.data?.data ?? [];
  const total = query.data?.meta?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const canCreate = hasPermission(
    session?.user.permissions,
    'associates:create',
  );

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Asociados</h1>
        {canCreate && (
          <Button asChild>
            <Link href="/asociados/nuevo">Nuevo asociado</Link>
          </Button>
        )}
      </div>

      <div className="flex flex-wrap gap-2">
        <Input
          placeholder="Buscar por nombre, apellido o identificación..."
          value={searchInput}
          onChange={(event) => {
            setPage(1);
            setSearchInput(event.target.value);
          }}
          className="max-w-sm"
        />
        <Select
          value={sort}
          onValueChange={(value) => {
            setPage(1);
            setSort(value);
          }}
        >
          <SelectTrigger className="w-64">
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
          description={
            search
              ? 'No se encontraron asociados con ese criterio de búsqueda.'
              : 'Todavía no hay asociados registrados.'
          }
        />
      )}

      {query.isSuccess && rows.length > 0 && (
        <>
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
                      className="font-medium hover:underline"
                    >
                      {associate.numberIdentity}
                    </Link>
                  </TableCell>
                  <TableCell>{associateFullName(associate)}</TableCell>
                  <TableCell>{associate.identityTypeName}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        associate.status === 'ACTIVE' ? 'default' : 'secondary'
                      }
                    >
                      {associate.status === 'ACTIVE' ? 'Activo' : 'Inactivo'}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>
              Página {page} de {totalPages} · {total} asociados
            </span>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={page <= 1}
                onClick={() => setPage((current) => current - 1)}
              >
                Anterior
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={page >= totalPages}
                onClick={() => setPage((current) => current + 1)}
              >
                Siguiente
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
