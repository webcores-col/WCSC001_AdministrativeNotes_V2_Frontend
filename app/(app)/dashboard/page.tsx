'use client';

import type { LucideIcon } from 'lucide-react';
import {
  ArrowRight,
  CalendarDays,
  FileText,
  Plus,
  UserCog,
  Users,
} from 'lucide-react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { EmptyState } from '@/components/shared/EmptyState';
import { ErrorState } from '@/components/shared/ErrorState';
import { LoadingState } from '@/components/shared/LoadingState';
import { PageHeader } from '@/components/shared/PageHeader';
import { UserAvatar } from '@/components/shared/UserAvatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { associateFullName } from '@/lib/api/associate-utils';
import { getErrorMessage } from '@/lib/api/error-message';
import { formatDateShort, formatNumberIdentity } from '@/lib/format';
import { hasPermission } from '@/lib/permissions/has-permission';
import { useAssociatesQuery } from '@/lib/query/associates';
import { useNotesQuery } from '@/lib/query/notes';
import { useUsersQuery } from '@/lib/query/users';

/** Mismo criterio que la pantalla principal del legacy: size=6&sort=updatedAt:desc. */
export default function DashboardPage() {
  const { data: session } = useSession();
  const permissions = session?.user.permissions;
  const canReadUsers = hasPermission(permissions, 'users:read');
  const canCreateNotes = hasPermission(permissions, 'notes:create');
  const canCreateAssociates = hasPermission(permissions, 'associates:create');

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
    <div className="flex flex-col gap-8">
      <PageHeader
        title={`Hola, ${session?.user.names ?? ''}`}
        description="Resumen de la operación al día de hoy."
        actions={
          <span className="inline-flex items-center gap-2 rounded-full border border-border-subtle bg-card px-4 py-1.5 text-sm font-medium whitespace-nowrap">
            <CalendarDays
              className="size-4 text-muted-foreground"
              aria-hidden="true"
            />
            {formatDateShort(new Date())}
          </span>
        }
      />

      {(canCreateNotes || canCreateAssociates) && (
        <div className="flex flex-wrap gap-3">
          {canCreateNotes && (
            <Button asChild>
              <Link href="/pagares/nuevo">
                <Plus aria-hidden="true" />
                Nuevo pagaré
              </Link>
            </Button>
          )}
          {canCreateAssociates && (
            <Button asChild variant="outline">
              <Link href="/asociados/nuevo">
                <Plus aria-hidden="true" />
                Nuevo asociado
              </Link>
            </Button>
          )}
        </div>
      )}

      <Card className="flex-col gap-0 divide-y divide-border-subtle overflow-hidden p-0 sm:flex-row sm:divide-x sm:divide-y-0">
        <SummarySegment
          title="Asociados"
          icon={Users}
          value={recentAssociates.data?.meta?.total}
          isLoading={recentAssociates.isLoading}
          isError={recentAssociates.isError}
          href="/asociados"
        />
        <SummarySegment
          title="Pagarés"
          icon={FileText}
          value={notesCount.data?.meta?.total}
          isLoading={notesCount.isLoading}
          isError={notesCount.isError}
          href="/pagares"
        />
        {canReadUsers && (
          <SummarySegment
            title="Usuarios"
            icon={UserCog}
            value={usersCount.data?.meta?.total}
            isLoading={usersCount.isLoading}
            isError={usersCount.isError}
            href="/usuarios"
          />
        )}
      </Card>

      <section className="flex flex-col gap-4">
        <div className="flex items-baseline justify-between gap-4">
          <h2 className="text-lg font-semibold">
            Asociados actualizados recientemente
          </h2>
          <Link
            href="/asociados"
            className="inline-flex shrink-0 items-center gap-1 text-sm font-medium text-primary transition-colors hover:text-green-700 focus-visible:rounded-sm focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none"
          >
            Ver todos
            <ArrowRight className="size-3.5" aria-hidden="true" />
          </Link>
        </div>

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
            <Card className="gap-0 overflow-hidden py-0">
              <ul className="divide-y divide-border-subtle">
                {recentAssociates.data.data.map((associate) => (
                  <li key={associate.numberIdentity}>
                    <Link
                      href={`/asociados/${associate.numberIdentity}`}
                      className="flex items-center justify-between gap-4 px-5 py-4 transition-colors hover:bg-surface-soft"
                    >
                      <span className="flex min-w-0 items-center gap-3">
                        <UserAvatar name={associateFullName(associate)} />
                        <span className="min-w-0">
                          <span className="block truncate font-medium">
                            {associateFullName(associate)}
                          </span>
                          <span className="block font-mono text-xs text-muted-foreground tabular-nums">
                            {formatNumberIdentity(associate.numberIdentity)}
                          </span>
                        </span>
                      </span>
                      <Badge
                        variant={
                          associate.status === 'ACTIVE'
                            ? 'success'
                            : 'secondary'
                        }
                      >
                        {associate.status === 'ACTIVE' ? 'Activo' : 'Inactivo'}
                      </Badge>
                    </Link>
                  </li>
                ))}
              </ul>
            </Card>
          )}
      </section>
    </div>
  );
}

function SummarySegment({
  title,
  icon: Icon,
  value,
  isLoading,
  isError,
  href,
}: {
  title: string;
  icon: LucideIcon;
  value: number | undefined;
  isLoading: boolean;
  isError: boolean;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="group flex flex-1 items-center gap-3 px-5 py-4 transition-colors hover:bg-surface-soft focus-visible:relative focus-visible:z-10 focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none"
    >
      <span
        aria-hidden="true"
        className="flex size-9 shrink-0 items-center justify-center rounded-md bg-primary-soft text-primary-soft-foreground transition-colors group-hover:bg-primary-soft/80"
      >
        <Icon className="size-4" />
      </span>
      <span className="flex min-w-0 flex-col gap-0.5">
        <span className="text-xs text-muted-foreground">{title}</span>
        {isLoading ? (
          <Skeleton className="h-6 w-12" />
        ) : (
          <span className="font-mono text-xl leading-none font-semibold tracking-tight tabular-nums">
            {isError ? '—' : value}
          </span>
        )}
      </span>
    </Link>
  );
}
