'use client';

import { useParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { EditAssociateForm } from '@/components/domain/associates/EditAssociateForm';
import { ErrorState } from '@/components/shared/ErrorState';
import { LoadingState } from '@/components/shared/LoadingState';
import { Badge } from '@/components/ui/badge';
import { getSurname2 } from '@/lib/api/associate-utils';
import { getErrorMessage } from '@/lib/api/error-message';
import type { AssociateResponseDto } from '@/lib/api/types';
import { hasPermission } from '@/lib/permissions/has-permission';
import { useAssociateQuery } from '@/lib/query/associates';

export default function AsociadoDetallePage() {
  const params = useParams<{ numberIdentity: string }>();
  const { data: session } = useSession();
  const query = useAssociateQuery(params.numberIdentity);
  const canUpdate = hasPermission(
    session?.user.permissions,
    'associates:update',
  );

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-semibold">
        Asociado {params.numberIdentity}
      </h1>

      {query.isLoading && <LoadingState />}

      {query.isError && (
        <ErrorState
          message={getErrorMessage(query.error)}
          onRetry={() => query.refetch()}
        />
      )}

      {query.isSuccess &&
        (canUpdate ? (
          <EditAssociateForm associate={query.data} />
        ) : (
          <AssociateReadOnly associate={query.data} />
        ))}
    </div>
  );
}

function AssociateReadOnly({ associate }: { associate: AssociateResponseDto }) {
  return (
    <dl className="grid max-w-md grid-cols-2 gap-x-4 gap-y-3 text-sm">
      <dt className="text-muted-foreground">Tipo de identificación</dt>
      <dd>{associate.identityTypeName}</dd>
      <dt className="text-muted-foreground">Nombres</dt>
      <dd>{associate.names}</dd>
      <dt className="text-muted-foreground">Apellidos</dt>
      <dd>
        {associate.surname1} {getSurname2(associate)}
      </dd>
      <dt className="text-muted-foreground">Fecha de nacimiento</dt>
      <dd>{associate.dateBirth}</dd>
      <dt className="text-muted-foreground">Estado</dt>
      <dd>
        <Badge
          variant={associate.status === 'ACTIVE' ? 'default' : 'secondary'}
        >
          {associate.status === 'ACTIVE' ? 'Activo' : 'Inactivo'}
        </Badge>
      </dd>
    </dl>
  );
}
