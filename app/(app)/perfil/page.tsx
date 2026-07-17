"use client";

import { useSession } from "next-auth/react";
import { ChangeMyPasswordForm } from "@/components/domain/users/ChangeMyPasswordForm";
import { ROLE_LABELS } from "@/lib/permissions/role-labels";

export default function PerfilPage() {
  const { data: session } = useSession();

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold">Mi perfil</h1>
        {session && (
          <p className="text-muted-foreground">
            {session.user.names} {session.user.surnames} ·{" "}
            {ROLE_LABELS[session.user.role] ?? session.user.role}
          </p>
        )}
      </div>
      <div>
        <h2 className="mb-4 text-lg font-semibold">Cambiar contraseña</h2>
        <ChangeMyPasswordForm />
      </div>
    </div>
  );
}
