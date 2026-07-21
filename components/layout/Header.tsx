import { UserMenu } from '@/components/layout/UserMenu';
import type { SessionUser } from '@/lib/auth/session-types';

export function Header({ user }: { user: SessionUser }) {
  return (
    <header className="flex items-center justify-end border-b bg-background px-8 py-4">
      <UserMenu user={user} />
    </header>
  );
}
