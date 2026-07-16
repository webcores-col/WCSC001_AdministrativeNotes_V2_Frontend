import { Suspense } from "react";
import { LoginForm } from "@/components/domain/auth/LoginForm";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function LoginPage() {
  return (
    <main className="flex flex-1 items-center justify-center bg-background p-8">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-xl">Pagarés COINTRAMIN</CardTitle>
          <CardDescription>
            Ingrese sus credenciales para continuar.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Suspense>
            <LoginForm />
          </Suspense>
        </CardContent>
      </Card>
    </main>
  );
}
