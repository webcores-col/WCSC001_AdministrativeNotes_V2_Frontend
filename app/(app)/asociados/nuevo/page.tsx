import { CreateAssociateForm } from '@/components/domain/associates/CreateAssociateForm';

export default function NuevoAsociadoPage() {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-semibold">Nuevo asociado</h1>
      <CreateAssociateForm />
    </div>
  );
}
