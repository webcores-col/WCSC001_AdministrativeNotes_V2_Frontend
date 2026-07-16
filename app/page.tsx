import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

/**
 * Placeholder de Fase 1 (fundaciones): confirma que el sistema de diseño
 * (paleta, tipografía, componentes shadcn/ui) está cableado end-to-end.
 * Se reemplaza en la Fase 3 por la redirección real según sesión
 * (con sesión → /dashboard, sin sesión → /login).
 */
export default function Home() {
  return (
    <main className="flex flex-1 items-center justify-center bg-background p-8">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl">Pagarés COINTRAMIN</CardTitle>
            <Badge variant="secondary">v0.1 · fundaciones</Badge>
          </div>
          <CardDescription>
            Frontend oficial de gestión de asociados y pagarés — en
            construcción.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span className="size-2 rounded-full bg-primary" />
            Primario — Verde petróleo
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span className="size-2 rounded-full bg-success" />
            Éxito
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span className="size-2 rounded-full bg-warning" />
            Advertencia
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span className="size-2 rounded-full bg-destructive" />
            Destructivo
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
