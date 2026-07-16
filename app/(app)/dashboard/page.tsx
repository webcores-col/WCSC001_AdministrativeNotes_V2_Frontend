import { auth, signOut } from "@/auth";
import { Button } from "@/components/ui/button";

/**
 * Placeholder de Fase 3: verifica el ciclo completo de sesión (login →
 * sesión visible server-side → logout revoca en backend). La Fase 4 lo
 * envuelve en el AppShell real y la Fase 9 construye el dashboard real
 * (asociados recientes + contadores).
 */
export default async function DashboardPage() {
  const session = await auth();

  return (
    <main className="flex flex-1 flex-col gap-4 p-8">
      <h1 className="text-2xl font-semibold">Hola, {session?.user.names}</h1>
      <p className="text-muted-foreground">Rol: {session?.user.role}</p>
      <form
        action={async () => {
          "use server";
          await signOut({ redirectTo: "/login" });
        }}
      >
        <Button type="submit" variant="outline">
          Cerrar sesión
        </Button>
      </form>
    </main>
  );
}
