'use client';

import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { EmptyState } from '@/components/shared/EmptyState';
import { ErrorState } from '@/components/shared/ErrorState';
import { LoadingState } from '@/components/shared/LoadingState';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { associateFullName } from '@/lib/api/associate-utils';
import { getErrorMessage } from '@/lib/api/error-message';
import { hasPermission } from '@/lib/permissions/has-permission';
import { useAssociatesQuery } from '@/lib/query/associates';
import { useNotesQuery } from '@/lib/query/notes';
import { useUsersQuery } from '@/lib/query/users';

/** Mismo criterio que la pantalla principal del legacy: size=6&sort=updatedAt:desc. */
export default function DashboardPage() {
  const { data: session } = useSession();
  const canReadUsers = hasPermission(session?.user.permissions, 'users:read');

  const recentAssociates = useAssociatesQuery({
    page: 1,
    size: 6,
    search: '',
    sort: 'updatedAt:desc',
  });
  const notesCount = useNotesQuery({ page: 1, size: 1, associateId: '' });
  const usersCount = useUsersQuery(
    { page: 1, size: 1, search: '' },
    { enabled: canReadUsers },
  );

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold">Hola, {session?.user.names}</h1>
        <p className="text-muted-foreground">Rol: {session?.user.role}</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard
          title="Asociados"
          value={recentAssociates.data?.meta?.total}
          isLoading={recentAssociates.isLoading}
          isError={recentAssociates.isError}
          href="/asociados"
        />
        <StatCard
          title="Pagarés"
          value={notesCount.data?.meta?.total}
          isLoading={notesCount.isLoading}
          isError={notesCount.isError}
          href="/pagares"
        />
        {canReadUsers && (
          <StatCard
            title="Usuarios"
            value={usersCount.data?.meta?.total}
            isLoading={usersCount.isLoading}
            isError={usersCount.isError}
            href="/usuarios"
          />
        )}
      </div>

      <div className="flex flex-col gap-4">
        <h2 className="text-lg font-semibold">
          Asociados actualizados recientemente
        </h2>

        {recentAssociates.isLoading && <LoadingState rows={6} />}

        {recentAssociates.isError && (
          <ErrorState
            message={getErrorMessage(recentAssociates.error)}
            onRetry={() => recentAssociates.refetch()}
          />
        )}

        {recentAssociates.isSuccess &&
          recentAssociates.data.data.length === 0 && (
            <EmptyState
              title="Sin asociados"
              description="Todavía no hay asociados registrados."
            />
          )}

        {recentAssociates.isSuccess &&
          recentAssociates.data.data.length > 0 && (
            <ul className="flex flex-col divide-y rounded-md border">
              {recentAssociates.data.data.map((associate) => (
                <li key={associate.numberIdentity}>
                  <Link
                    href={`/asociados/${associate.numberIdentity}`}
                    className="flex items-center justify-between gap-4 px-4 py-3 hover:bg-accent"
                  >
                    <div>
                      <p className="font-medium">
                        {associateFullName(associate)}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {associate.numberIdentity}
                      </p>
                    </div>
                    <Badge
                      variant={
                        associate.status === 'ACTIVE' ? 'default' : 'secondary'
                      }
                    >
                      {associate.status === 'ACTIVE' ? 'Activo' : 'Inactivo'}
                    </Badge>
                  </Link>
                </li>
              ))}
            </ul>
          )}
      </div>
    </div>
  );
}

function StatCard({
  title,
  value,
  isLoading,
  isError,
  href,
}: {
  title: string;
  value: number | undefined;
  isLoading: boolean;
  isError: boolean;
  href: string;
}) {
  return (
    <Link href={href}>
      <Card className="transition-colors hover:bg-accent/50">
        <CardHeader>
          <CardDescription>{title}</CardDescription>
          <CardTitle className="text-3xl">
            {isLoading ? '…' : isError ? '—' : value}
          </CardTitle>
        </CardHeader>
      </Card>
    </Link>
  );
}
