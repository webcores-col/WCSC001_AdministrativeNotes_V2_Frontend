import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import type { SessionUser } from "@/lib/auth/session-types";

export function AppShell({
  user,
  children,
}: {
  user: SessionUser;
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-1">
      <Sidebar permissions={user.permissions} />
      <div className="flex flex-1 flex-col">
        <Header user={user} />
        <main className="flex flex-1 flex-col gap-4 p-8">{children}</main>
      </div>
    </div>
  );
}
