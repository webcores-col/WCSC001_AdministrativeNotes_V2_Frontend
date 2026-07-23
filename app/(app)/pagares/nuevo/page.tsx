import { CreateNoteForm } from '@/components/domain/notes/CreateNoteForm';
import { PageHeader } from '@/components/shared/PageHeader';
import { Card, CardContent } from '@/components/ui/card';

export default function NuevoPagarePage() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Nuevo pagaré"
        description="Vincule el deudor, el tipo y los codeudores si aplican."
      />
      <Card className="max-w-lg">
        <CardContent>
          <CreateNoteForm />
        </CardContent>
      </Card>
    </div>
  );
}
