'use client';

import type { LucideIcon } from 'lucide-react';
import { CalendarDays, FileText, Plus, UserCog, Users } from 'lucide-react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { EmptyState } from '@/components/shared/EmptyState';
import { ErrorState } from '@/components/shared/ErrorState';
import { LoadingState } from '@/components/shared/LoadingState';
import { PageHeader } from '@/components/shared/PageHeader';
import { UserAvatar } from '@/components/shared/UserAvatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
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

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1.6fr_1fr]">
        <HeroStat
          title="Pagarés"
          foot="notas administrativas registradas"
          icon={FileText}
          value={notesCount.data?.meta?.total}
          isLoading={notesCount.isLoading}
          isError={notesCount.isError}
          href="/pagares"
        />
        <Card className="gap-0 divide-y divide-border-subtle overflow-hidden py-0">
          <CompactStat
            title="Asociados"
            icon={Users}
            value={recentAssociates.data?.meta?.total}
            isLoading={recentAssociates.isLoading}
            isError={recentAssociates.isError}
            href="/asociados"
          />
          {canReadUsers && (
            <CompactStat
              title="Usuarios"
              icon={UserCog}
              value={usersCount.data?.meta?.total}
              isLoading={usersCount.isLoading}
              isError={usersCount.isError}
              href="/usuarios"
            />
          )}
        </Card>
      </div>

      <section className="flex flex-col gap-4">
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
            <Card className="gap-0 overflow-hidden py-0">
              <ul className="divide-y divide-border-subtle">
                {recentAssociates.data.data.map((associate) => (
                  <li key={associate.numberIdentity}>
                    <Link
                      href={`/asociados/${associate.numberIdentity}`}
                      className="flex items-center justify-between gap-4 px-5 py-3.5 transition-colors hover:bg-surface-soft"
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

/**
 * Métrica protagonista del resumen: Pagarés es el objeto central del
 * negocio (posicionamiento del producto), así que lleva más peso visual
 * que Asociados/Usuarios en vez de repetir la misma card tres veces.
 */
function HeroStat({
  title,
  foot,
  icon: Icon,
  value,
  isLoading,
  isError,
  href,
}: {
  title: string;
  foot: string;
  icon: LucideIcon;
  value: number | undefined;
  isLoading: boolean;
  isError: boolean;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="group rounded-xl focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none"
    >
      <Card className="h-full gap-0 py-7 transition-[transform,box-shadow] duration-200 ease-out-soft group-hover:shadow-md motion-safe:group-hover:-translate-y-0.5">
        <CardHeader className="gap-4">
          <div className="flex items-center gap-3.5">
            <span
              aria-hidden="true"
              className="flex size-12 shrink-0 items-center justify-center rounded-lg bg-primary-soft text-primary-soft-foreground"
            >
              <Icon className="size-5" />
            </span>
            <CardDescription className="text-xs font-medium tracking-[0.08em] uppercase">
              {title}
            </CardDescription>
          </div>
          <CardTitle className="text-[clamp(2.25rem,1.7rem+2.4vw,3.25rem)] tracking-tight tabular-nums">
            {isLoading ? (
              <Skeleton className="h-11 w-24" />
            ) : isError ? (
              '—'
            ) : (
              value
            )}
          </CardTitle>
          <CardDescription>{foot}</CardDescription>
        </CardHeader>
      </Card>
    </Link>
  );
}

/** Fila compacta para las métricas secundarias, agrupadas en una sola card. */
function CompactStat({
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
      className="flex items-center justify-between gap-4 px-5 py-4 transition-colors hover:bg-surface-soft"
    >
      <span className="flex items-center gap-3">
        <span
          aria-hidden="true"
          className="flex size-8 shrink-0 items-center justify-center rounded-md bg-primary-soft text-primary-soft-foreground"
        >
          <Icon className="size-4" />
        </span>
        <span className="text-sm font-medium text-muted-foreground">
          {title}
        </span>
      </span>
      <span className="text-xl font-semibold tabular-nums">
        {isLoading ? <Skeleton className="h-6 w-10" /> : isError ? '—' : value}
      </span>
    </Link>
  );
}
