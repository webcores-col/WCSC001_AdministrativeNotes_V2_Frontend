import { CreateNoteForm } from "@/components/domain/notes/CreateNoteForm";

export default function NuevoPagarePage() {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-semibold">Nuevo pagaré</h1>
      <CreateNoteForm />
    </div>
  );
}
