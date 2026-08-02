'use client';

import { Plus, X } from 'lucide-react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { AssociatePicker } from '@/components/domain/associates/AssociatePicker';
import { DeleteNoteDialog } from '@/components/domain/notes/DeleteNoteDialog';
import { EmptyState } from '@/components/shared/EmptyState';
import { ErrorState } from '@/components/shared/ErrorState';
import { EmptyResults } from '@/components/shared/illustrations/EmptyResults';
import { LoadingState } from '@/components/shared/LoadingState';
import { PageHeader } from '@/components/shared/PageHeader';
import { TableCard } from '@/components/shared/TableCard';
import { TablePagination } from '@/components/shared/TablePagination';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
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
import { formatDateShort } from '@/lib/format';
import { useListUrlState } from '@/lib/hooks/use-list-url-state';
import { hasPermission } from '@/lib/permissions/has-permission';
import { useNotesQuery } from '@/lib/query/notes';

const PAGE_SIZE = 20;

/** Chip de folio — la firma del talonario (plan §3), solo en este módulo. */
function Folio({ id }: { id: number }) {
  return (
    <span className="inline-flex items-center rounded-sm border border-border-subtle bg-surface-soft px-2 py-0.5 font-mono text-xs font-medium tracking-[0.02em] tabular-nums">
      Nº {id}
    </span>
  );
}

export default function PagaresPage() {
  const { data: session } = useSession();
  // Filtro de deudor y página viven en la URL (§8).
  const { searchParams, setParams, page, setPage } = useListUrlState();
  const associateId = searchParams.get('deudor') ?? undefined;
  const setAssociateId = (value: string | undefined) =>
    setParams({ deudor: value, page: undefined });

  const query = useNotesQuery({
    page,
    size: PAGE_SIZE,
    associateId: associateId ?? '',
  });
  const rows = query.data?.data ?? [];
  const total = query.data?.meta?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const canCreate = hasPermission(session?.user.permissions, 'notes:create');
  const canDelete = hasPermission(session?.user.permissions, 'notes:delete');

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Pagarés"
        description="Notas administrativas registradas."
        actions={
          canCreate && (
            <Button asChild>
              <Link href="/pagares/nuevo">
                <Plus aria-hidden="true" />
                Nuevo pagaré
              </Link>
            </Button>
          )
        }
      />

      <div className="flex flex-wrap items-end gap-2">
        <div className="w-72">
          <Label
            htmlFor="associateId-filter-picker"
            className="mb-1 block text-sm text-muted-foreground"
          >
            Filtrar por deudor
          </Label>
          <AssociatePicker
            id="associateId-filter-picker"
            value={associateId}
            onChange={setAssociateId}
            placeholder="Todos los deudores"
          />
        </div>
        {associateId && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setAssociateId(undefined)}
          >
            <X aria-hidden="true" />
            Quitar filtro
          </Button>
        )}
        {query.isSuccess && (
          <span className="ml-auto self-center text-xs text-muted-foreground tabular-nums">
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
          title="No hay pagarés"
          // «Sin resultados» por filtro es un estado distinto del «sin
          // datos» real (§7): ilustración de búsqueda + copia propia.
          illustration={associateId ? <EmptyResults /> : undefined}
          description={
            associateId
              ? 'Este asociado no tiene pagarés registrados. Quite el filtro para ver todos.'
              : 'Todavía no hay pagarés registrados. Cree el primero con «Nuevo pagaré».'
          }
        />
      )}

      {query.isSuccess && rows.length > 0 && (
        <TableCard
          table={
            <Table>
              {/*
               * Variante ink del header, reservada a Pagarés (plan §5.4):
               * fondo casi-negro + troquel punteado debajo — la firma del
               * talonario. El hover de fila del primitivo se anula en el
               * propio header.
               */}
              <TableHeader className="bg-surface-ink [&_th]:text-surface-ink-foreground/75 [&_tr]:border-b-[1.5px] [&_tr]:border-dashed [&_tr]:border-surface-ink-foreground/25 [&_tr]:hover:bg-surface-ink">
                <TableRow>
                  <TableHead>Pagaré</TableHead>
                  <TableHead>Deudor</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Codeudor 1</TableHead>
                  <TableHead>Codeudor 2</TableHead>
                  <TableHead>Registrado</TableHead>
                  {canDelete && (
                    <TableHead className="text-right">Acciones</TableHead>
                  )}
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((note) => (
                  <TableRow key={note.id}>
                    <TableCell>
                      <Folio id={note.id} />
                    </TableCell>
                    <TableCell>
                      <Link
                        href={`/pagares/${note.id}`}
                        className="font-medium hover:underline"
                      >
                        {associateFullName(note.associate)}
                      </Link>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {note.noteType.name}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {note.codeudor1 ? associateFullName(note.codeudor1) : '—'}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {note.codeudor2 ? associateFullName(note.codeudor2) : '—'}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {formatDateShort(note.createdAt)}
                    </TableCell>
                    {canDelete && (
                      <TableCell className="text-right">
                        <DeleteNoteDialog noteId={note.id} />
                      </TableCell>
                    )}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          }
          cards={rows.map((note) => (
            <li key={note.id} className="flex flex-col gap-2 px-4 py-3">
              <div className="flex items-center justify-between gap-3">
                <Folio id={note.id} />
                <span className="text-xs text-muted-foreground">
                  {formatDateShort(note.createdAt)}
                </span>
              </div>
              <Link
                href={`/pagares/${note.id}`}
                className="text-sm font-medium hover:underline"
              >
                {associateFullName(note.associate)}
              </Link>
              <div className="flex items-center justify-between gap-3">
                <span className="text-xs text-muted-foreground">
                  {note.noteType.name}
                </span>
                {canDelete && <DeleteNoteDialog noteId={note.id} />}
              </div>
            </li>
          ))}
          footer={
            <TablePagination
              page={page}
              totalPages={totalPages}
              total={total}
              noun="pagarés"
              onPageChange={setPage}
            />
          }
        />
      )}
    </div>
  );
}
