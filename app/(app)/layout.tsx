import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { AppShell } from "@/components/layout/AppShell";
import { QueryProvider } from "@/components/providers/QueryProvider";

/**
 * `proxy.ts` ya redirige a `/login` sin sesión válida; este `redirect` es
 * puramente de tipos, para que `AppShell` reciba `user` sin `?.` en cascada
 * en el resto del route group protegido.
 */
export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session) {
    redirect("/login");
  }

  return (
    <QueryProvider>
      <AppShell user={session.user}>{children}</AppShell>
    </QueryProvider>
  );
}
