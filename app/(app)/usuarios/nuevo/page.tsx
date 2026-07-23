import { CreateUserForm } from '@/components/domain/users/CreateUserForm';
import { PageHeader } from '@/components/shared/PageHeader';
import { Card, CardContent } from '@/components/ui/card';

export default function NuevoUsuarioPage() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Nuevo usuario"
        description="Cree la cuenta y asígnele un rol."
      />
      <Card className="max-w-2xl">
        <CardContent>
          <CreateUserForm />
        </CardContent>
      </Card>
    </div>
  );
}
