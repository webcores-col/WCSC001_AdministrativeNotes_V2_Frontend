import { Header } from '@/components/layout/Header';
import { Sidebar } from '@/components/layout/Sidebar';
import type { SessionUser } from '@/lib/auth/session-types';

export function AppShell({
  user,
  children,
}: {
  user: SessionUser;
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-1">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:rounded-md focus:bg-card focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:shadow-md"
      >
        Ir al contenido
      </a>
      <Sidebar permissions={user.permissions} />
      <div className="flex min-w-0 flex-1 flex-col">
        <Header user={user} />
        <main
          id="main"
          className="flex flex-1 flex-col px-6 py-6 md:px-8 md:py-8 2xl:px-10"
        >
          <div className="mx-auto flex w-full max-w-[1440px] flex-1 flex-col gap-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
