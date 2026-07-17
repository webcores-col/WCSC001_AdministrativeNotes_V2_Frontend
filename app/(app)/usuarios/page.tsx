"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { ResetPasswordDialog } from "@/components/domain/users/ResetPasswordDialog";
import { RoleSelectDialog } from "@/components/domain/users/RoleSelectDialog";
import { ToggleStatusDialog } from "@/components/domain/users/ToggleStatusDialog";
import { EmptyState } from "@/components/shared/EmptyState";
import { ErrorState } from "@/components/shared/ErrorState";
import { LoadingState } from "@/components/shared/LoadingState";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getErrorMessage } from "@/lib/api/error-message";
import { useDebouncedValue } from "@/lib/hooks/use-debounced-value";
import { hasPermission } from "@/lib/permissions/has-permission";
import { ROLE_LABELS } from "@/lib/permissions/role-labels";
import { useUsersQuery } from "@/lib/query/users";

const PAGE_SIZE = 20;

export default function UsuariosPage() {
  const { data: session } = useSession();
  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const search = useDebouncedValue(searchInput, 300);

  const query = useUsersQuery({ page, size: PAGE_SIZE, search });
  const rows = query.data?.data ?? [];
  const total = query.data?.meta?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const canCreate = hasPermission(session?.user.permissions, "users:create");
  const canManage = hasPermission(session?.user.permissions, "users:update");

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Usuarios</h1>
        {canCreate && (
          <Button asChild>
            <Link href="/usuarios/nuevo">Nuevo usuario</Link>
          </Button>
        )}
      </div>

      <Input
        placeholder="Buscar por nombre, apellido o usuario..."
        value={searchInput}
        onChange={(event) => {
          setPage(1);
          setSearchInput(event.target.value);
        }}
        className="max-w-sm"
      />

      {query.isLoading && <LoadingState />}

      {query.isError && (
        <ErrorState
          message={getErrorMessage(query.error)}
          onRetry={() => query.refetch()}
        />
      )}

      {query.isSuccess && rows.length === 0 && (
        <EmptyState
          title="No hay usuarios"
          description="No se encontraron usuarios con ese criterio de búsqueda."
        />
      )}

      {query.isSuccess && rows.length > 0 && (
        <>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Código</TableHead>
                <TableHead>Nombre</TableHead>
                <TableHead>Usuario</TableHead>
                <TableHead>Rol</TableHead>
                <TableHead>Estado</TableHead>
                {canManage && (
                  <TableHead className="text-right">Acciones</TableHead>
                )}
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((user) => {
                const isSelf = user.code === session?.user.code;
                return (
                  <TableRow key={user.code}>
                    <TableCell className="font-mono">{user.code}</TableCell>
                    <TableCell>
                      {user.names} {user.surnames}
                    </TableCell>
                    <TableCell>{user.username}</TableCell>
                    <TableCell>
                      {ROLE_LABELS[user.role] ?? user.role}
                    </TableCell>
                    <TableCell>
                      <Badge variant={user.isActive ? "default" : "secondary"}>
                        {user.isActive ? "Activo" : "Inactivo"}
                      </Badge>
                    </TableCell>
                    {canManage && (
                      <TableCell>
                        <div className="flex justify-end gap-2">
                          {!isSelf && (
                            <>
                              <RoleSelectDialog
                                code={user.code}
                                username={user.username}
                                role={user.role}
                              />
                              <ToggleStatusDialog
                                code={user.code}
                                username={user.username}
                                isActive={user.isActive}
                              />
                            </>
                          )}
                          <ResetPasswordDialog
                            code={user.code}
                            username={user.username}
                          />
                        </div>
                      </TableCell>
                    )}
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>

          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>
              Página {page} de {totalPages} · {total} usuarios
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
