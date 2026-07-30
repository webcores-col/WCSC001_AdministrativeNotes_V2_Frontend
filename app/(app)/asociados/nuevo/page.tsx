import { CreateAssociateForm } from '@/components/domain/associates/CreateAssociateForm';
import { PageHeader } from '@/components/shared/PageHeader';

export default function NuevoAsociadoPage() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Nuevo asociado"
        description="Registre los datos de identificación del asociado."
      />
      <div className="max-w-2xl">
        <CreateAssociateForm />
      </div>
    </div>
  );
}
