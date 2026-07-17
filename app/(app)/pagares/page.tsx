"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { AssociatePicker } from "@/components/domain/associates/AssociatePicker";
import { DeleteNoteDialog } from "@/components/domain/notes/DeleteNoteDialog";
import { EmptyState } from "@/components/shared/EmptyState";
import { ErrorState } from "@/components/shared/ErrorState";
import { LoadingState } from "@/components/shared/LoadingState";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { associateFullName } from "@/lib/api/associate-utils";
import { getErrorMessage } from "@/lib/api/error-message";
import { hasPermission } from "@/lib/permissions/has-permission";
import { useNotesQuery } from "@/lib/query/notes";

const PAGE_SIZE = 20;

export default function PagaresPage() {
  const { data: session } = useSession();
  const [page, setPage] = useState(1);
  const [associateId, setAssociateId] = useState<string | undefined>();

  const query = useNotesQuery({
    page,
    size: PAGE_SIZE,
    associateId: associateId ?? "",
  });
  const rows = query.data?.data ?? [];
  const total = query.data?.meta?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const canCreate = hasPermission(session?.user.permissions, "notes:create");
  const canDelete = hasPermission(session?.user.permissions, "notes:delete");

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Pagarés</h1>
        {canCreate && (
          <Button asChild>
            <Link href="/pagares/nuevo">Nuevo pagaré</Link>
          </Button>
        )}
      </div>

      <div className="flex flex-wrap items-end gap-2">
        <div className="w-72">
          <span className="mb-1 block text-sm text-muted-foreground">
            Filtrar por deudor
          </span>
          <AssociatePicker
            value={associateId}
            onChange={(value) => {
              setPage(1);
              setAssociateId(value);
            }}
            placeholder="Todos los deudores"
          />
        </div>
        {associateId && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setPage(1);
              setAssociateId(undefined);
            }}
          >
            Quitar filtro
          </Button>
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
          description={
            associateId
              ? "Este asociado no tiene pagarés registrados."
              : "Todavía no hay pagarés registrados."
          }
        />
      )}

      {query.isSuccess && rows.length > 0 && (
        <>
          <Table>
            <TableHeader>
              <TableRow>
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
                    <Link
                      href={`/pagares/${note.id}`}
                      className="font-medium hover:underline"
                    >
                      {associateFullName(note.associate)}
                    </Link>
                  </TableCell>
                  <TableCell>{note.noteType.name}</TableCell>
                  <TableCell>
                    {note.codeudor1 ? associateFullName(note.codeudor1) : "—"}
                  </TableCell>
                  <TableCell>
                    {note.codeudor2 ? associateFullName(note.codeudor2) : "—"}
                  </TableCell>
                  <TableCell>
                    {new Date(note.createdAt).toLocaleDateString("es-CO")}
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

          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>
              Página {page} de {totalPages} · {total} pagarés
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
