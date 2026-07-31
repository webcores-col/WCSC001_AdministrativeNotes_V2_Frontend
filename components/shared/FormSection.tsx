import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

/**
 * Agrupa campos relacionados de un formulario largo bajo un título de
 * sección (plan de diseño §5.5): cada sección es su propia card, con un
 * grid de 2 columnas para los campos — los que necesiten ancho completo
 * usan `md:col-span-2` directamente en el `FormField`.
 */
export function FormSection({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {children}
      </CardContent>
    </Card>
  );
}
