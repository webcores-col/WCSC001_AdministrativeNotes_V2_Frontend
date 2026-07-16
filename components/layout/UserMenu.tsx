"use client";

import { LogOut } from "lucide-react";
import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { SessionUser } from "@/lib/auth/session-types";

/** Espejo de los roles reales del backend (ver docs/functional/modulos.md). */
const ROLE_LABELS: Record<string, string> = {
  ADMIN: "Administrador",
  OPERATOR: "Operador",
  VIEWER: "Consulta",
};

export function UserMenu({ user }: { user: SessionUser }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="gap-2">
          {user.names} {user.surnames}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel className="font-normal text-muted-foreground">
          {ROLE_LABELS[user.role] ?? user.role}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onSelect={() => signOut({ redirectTo: "/login" })}>
          <LogOut className="size-4" aria-hidden="true" />
          Cerrar sesión
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
