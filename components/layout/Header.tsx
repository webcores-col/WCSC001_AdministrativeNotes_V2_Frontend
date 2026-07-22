import { HeaderTitle } from '@/components/layout/HeaderTitle';
import { MobileNav } from '@/components/layout/MobileNav';
import { UserMenu } from '@/components/layout/UserMenu';
import type { SessionUser } from '@/lib/auth/session-types';

/** Topbar sticky del shell: hamburguesa (`< md`) + título corto + usuario. */
export function Header({ user }: { user: SessionUser }) {
  return (
    <header className="sticky top-0 z-40 flex h-16 shrink-0 items-center justify-between gap-4 border-b border-border-subtle bg-card px-6 md:px-8">
      <div className="flex items-center gap-2">
        <MobileNav permissions={user.permissions} />
        <HeaderTitle />
      </div>
      <UserMenu user={user} />
    </header>
  );
}
