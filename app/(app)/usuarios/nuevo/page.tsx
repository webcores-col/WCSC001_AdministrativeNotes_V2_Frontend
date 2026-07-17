import { CreateUserForm } from "@/components/domain/users/CreateUserForm";

export default function NuevoUsuarioPage() {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-semibold">Nuevo usuario</h1>
      <CreateUserForm />
    </div>
  );
}
