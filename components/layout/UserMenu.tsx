'use client';

import { ChevronDown, LogOut, UserRound } from 'lucide-react';
import { signOut } from 'next-auth/react';
import Link from 'next/link';
import { UserAvatar } from '@/components/shared/UserAvatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import type { SessionUser } from '@/lib/auth/session-types';
import { ROLE_LABELS } from '@/lib/permissions/role-labels';

export function UserMenu({ user }: { user: SessionUser }) {
  const fullName = `${user.names} ${user.surnames}`;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-auto gap-2.5 px-2 py-1.5">
          <UserAvatar name={fullName} />
          <span className="hidden text-left leading-tight md:block">
            <span className="block text-sm font-semibold">{fullName}</span>
            <span className="block text-[11px] font-normal text-muted-foreground">
              {ROLE_LABELS[user.role] ?? user.role}
            </span>
          </span>
          <ChevronDown
            className="hidden size-3.5 text-muted-foreground md:block"
            aria-hidden="true"
          />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel className="font-normal text-muted-foreground">
          {ROLE_LABELS[user.role] ?? user.role}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/perfil">
            <UserRound className="size-4" aria-hidden="true" />
            Mi perfil
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={() => signOut({ redirectTo: '/login' })}>
          <LogOut className="size-4" aria-hidden="true" />
          Cerrar sesión
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
