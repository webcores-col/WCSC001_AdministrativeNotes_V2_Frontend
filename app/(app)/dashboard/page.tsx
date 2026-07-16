import { auth } from "@/auth";

/**
 * Placeholder de Fase 4: vive dentro del AppShell real (sidebar + header con
 * logout, ver components/layout/). La Fase 9 construye el dashboard real
 * (asociados recientes + contadores).
 */
export default async function DashboardPage() {
  const session = await auth();

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-semibold">Hola, {session?.user.names}</h1>
      <p className="text-muted-foreground">Rol: {session?.user.role}</p>
    </div>
  );
}
