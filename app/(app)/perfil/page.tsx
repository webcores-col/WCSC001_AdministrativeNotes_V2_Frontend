'use client';

import { useSession } from 'next-auth/react';
import { ChangeMyPasswordForm } from '@/components/domain/users/ChangeMyPasswordForm';
import { PageHeader } from '@/components/shared/PageHeader';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { ROLE_LABELS } from '@/lib/permissions/role-labels';

export default function PerfilPage() {
  const { data: session } = useSession();

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Mi perfil"
        description={
          session
            ? `${session.user.names} ${session.user.surnames} · ${
                ROLE_LABELS[session.user.role] ?? session.user.role
              }`
            : undefined
        }
      />
      <Card className="max-w-lg">
        <CardHeader>
          <CardTitle>Cambiar contraseña</CardTitle>
          <CardDescription>
            Necesita su contraseña actual para confirmar el cambio.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ChangeMyPasswordForm />
        </CardContent>
      </Card>
    </div>
  );
}
