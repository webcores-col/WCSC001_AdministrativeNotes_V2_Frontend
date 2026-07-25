'use client';

import { ArrowLeft } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { DeleteNoteDialog } from '@/components/domain/notes/DeleteNoteDialog';
import { EmptyState } from '@/components/shared/EmptyState';
import { ErrorState } from '@/components/shared/ErrorState';
import { Folio } from '@/components/shared/Folio';
import { UserAvatar } from '@/components/shared/UserAvatar';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { associateFullName } from '@/lib/api/associate-utils';
import { getErrorMessage } from '@/lib/api/error-message';
import type { NoteAssociateSummaryDto } from '@/lib/api/types';
import { formatDateShort } from '@/lib/format';
import { hasPermission } from '@/lib/permissions/has-permission';
import { useNoteQuery } from '@/lib/query/notes';
import { cn } from '@/lib/utils';

/**
 * Ficha de documento (shapeado con /impeccable shape, ver
 * docs/PLAN_DISENO_UI.md §5.8): encabezado tipo letterhead con folio +
 * troquel, cuerpo en una sola card con las partes involucradas (enlazadas
 * a su propio detalle) y las fechas como metadato. Solo lectura — el
 * contrato no tiene notes:update, un pagaré nunca se edita.
 */
export default function PagareDetallePage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { data: session } = useSession();
  const noteId = Number(params.id);
  const isValidId = Number.isFinite(noteId);
  const query = useNoteQuery(isValidId ? noteId : undefined);
  const canDelete = hasPermission(session?.user.permissions, 'notes:delete');

  return (
    <div className="flex flex-col gap-6">
      <Link
        href="/pagares"
        className="inline-flex w-fit items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" aria-hidden="true" />
        Volver a pagarés
      </Link>

      {!isValidId && (
        <EmptyState
          title="Pagaré no encontrado"
          description={`No encontramos ningún pagaré con el número «${params.id}».`}
        />
      )}

      {isValidId && query.isLoading && (
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-3 border-b border-dashed border-border pb-6">
            <Skeleton className="h-5 w-16 rounded-sm" />
            <div className="flex flex-col gap-2">
              <Skeleton className="h-7 w-48" />
              <Skeleton className="h-4 w-32" />
            </div>
          </div>
          <Card className="max-w-xl gap-0 divide-y divide-border-subtle py-0">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="flex items-center gap-3 px-5 py-4">
                <Skeleton className="size-8 shrink-0 rounded-full" />
                <div className="flex flex-col gap-1.5">
                  <Skeleton className="h-3 w-16" />
                  <Skeleton className="h-4 w-40" />
                </div>
              </div>
            ))}
            <div className="flex flex-wrap gap-6 px-5 py-4">
              <Skeleton className="h-3 w-32" />
              <Skeleton className="h-3 w-40" />
            </div>
          </Card>
        </div>
      )}

      {isValidId && query.isError && (
        <ErrorState
          message={getErrorMessage(query.error)}
          onRetry={() => query.refetch()}
        />
      )}

      {isValidId && query.isSuccess && (
        <>
          <div className="flex flex-col gap-3 border-b border-dashed border-border pb-6">
            <Folio id={query.data.id} className="w-fit" />
            <div>
              <h1 className="text-2xl font-semibold tracking-tight">
                Pagaré Nº {query.data.id}
              </h1>
              <p className="text-sm text-muted-foreground">
                {query.data.noteType.name}
              </p>
            </div>
          </div>

          <Card className="max-w-xl gap-0 divide-y divide-border-subtle py-0">
            <PartyRow
              label="Deudor"
              associate={query.data.associate}
              emphasis
            />
            <PartyRow label="Codeudor 1" associate={query.data.codeudor1} />
            <PartyRow label="Codeudor 2" associate={query.data.codeudor2} />
            <div className="flex flex-wrap gap-x-6 gap-y-1 px-5 py-4 text-xs text-muted-foreground">
              <span>Registrado el {formatDateShort(query.data.createdAt)}</span>
              <span>
                Última actualización el {formatDateShort(query.data.updatedAt)}
              </span>
            </div>
          </Card>

          {canDelete && (
            <div className="flex max-w-xl justify-end">
              <DeleteNoteDialog
                noteId={query.data.id}
                onDeleted={() => router.push('/pagares')}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
}

function PartyRow({
  label,
  associate,
  emphasis = false,
}: {
  label: string;
  associate: NoteAssociateSummaryDto | null | undefined;
  emphasis?: boolean;
}) {
  return (
    <div className="flex flex-col gap-2 px-5 py-4">
      <span className="text-[11px] font-medium tracking-[0.08em] text-muted-foreground uppercase">
        {label}
      </span>
      {associate ? (
        <Link
          href={`/asociados/${associate.numberIdentity}`}
          className="group flex w-fit items-center gap-3 rounded-sm focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none"
        >
          <UserAvatar
            name={associateFullName(associate)}
            className={emphasis ? undefined : 'size-7 text-[10px]'}
          />
          <span>
            <span
              className={cn(
                'block font-medium group-hover:underline',
                emphasis ? 'text-base' : 'text-sm',
              )}
            >
              {associateFullName(associate)}
            </span>
            <span className="block font-mono text-xs text-muted-foreground tabular-nums">
              {associate.numberIdentity}
            </span>
          </span>
        </Link>
      ) : (
        <span className="text-sm text-muted-foreground">
          Sin {label.toLowerCase()}
        </span>
      )}
    </div>
  );
}
