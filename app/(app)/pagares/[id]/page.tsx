'use client';

import { useParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { DeleteNoteDialog } from '@/components/domain/notes/DeleteNoteDialog';
import { ErrorState } from '@/components/shared/ErrorState';
import { LoadingState } from '@/components/shared/LoadingState';
import { PageHeader } from '@/components/shared/PageHeader';
import { associateFullName } from '@/lib/api/associate-utils';
import { getErrorMessage } from '@/lib/api/error-message';
import { formatDateOnly } from '@/lib/format';
import { hasPermission } from '@/lib/permissions/has-permission';
import { useNoteQuery } from '@/lib/query/notes';

export default function PagareDetallePage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { data: session } = useSession();
  const noteId = Number(params.id);
  const query = useNoteQuery(Number.isFinite(noteId) ? noteId : undefined);
  const canDelete = hasPermission(session?.user.permissions, 'notes:delete');

  return (
    <div className="flex flex-col gap-4">
      <PageHeader title={`Pagaré Nº ${params.id}`} />

      {query.isLoading && <LoadingState variant="detail" />}

      {query.isError && (
        <ErrorState
          message={getErrorMessage(query.error)}
          onRetry={() => query.refetch()}
        />
      )}

      {query.isSuccess && (
        <>
          <dl className="grid max-w-md grid-cols-2 gap-x-4 gap-y-3 text-sm">
            <dt className="text-muted-foreground">Deudor</dt>
            <dd>
              {associateFullName(query.data.associate)} (
              {query.data.associate.numberIdentity})
            </dd>
            <dt className="text-muted-foreground">Tipo</dt>
            <dd>{query.data.noteType.name}</dd>
            {/*
             * Fecha del pagaré: el dato de negocio con el que el backend
             * decide si dos registros son duplicados. «Registrado» (abajo)
             * es el instante técnico de inserción, para auditoría.
             */}
            <dt className="text-muted-foreground">Fecha del pagaré</dt>
            <dd>{formatDateOnly(query.data.noteDate)}</dd>
            <dt className="text-muted-foreground">Codeudor 1</dt>
            <dd>
              {query.data.codeudor1
                ? `${associateFullName(query.data.codeudor1)} (${query.data.codeudor1.numberIdentity})`
                : '—'}
            </dd>
            <dt className="text-muted-foreground">Codeudor 2</dt>
            <dd>
              {query.data.codeudor2
                ? `${associateFullName(query.data.codeudor2)} (${query.data.codeudor2.numberIdentity})`
                : '—'}
            </dd>
            <dt className="text-muted-foreground">Registrado</dt>
            <dd>{new Date(query.data.createdAt).toLocaleString('es-CO')}</dd>
          </dl>

          {canDelete && (
            <DeleteNoteDialog
              noteId={query.data.id}
              onDeleted={() => router.push('/pagares')}
            />
          )}
        </>
      )}
    </div>
  );
}
