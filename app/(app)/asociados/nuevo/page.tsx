import { CreateAssociateForm } from '@/components/domain/associates/CreateAssociateForm';
import { PageHeader } from '@/components/shared/PageHeader';
import { Card, CardContent } from '@/components/ui/card';

export default function NuevoAsociadoPage() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Nuevo asociado"
        description="Registre los datos de identificación del asociado."
      />
      <Card className="max-w-2xl">
        <CardContent>
          <CreateAssociateForm />
        </CardContent>
      </Card>
    </div>
  );
}
