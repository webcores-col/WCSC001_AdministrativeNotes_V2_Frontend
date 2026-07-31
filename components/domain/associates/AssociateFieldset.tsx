'use client';

import type { Control, FieldValues, Path } from 'react-hook-form';
import { FormSection } from '@/components/shared/FormSection';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useIdentityTypesQuery } from '@/lib/query/catalogs';

interface AssociateSharedFields extends FieldValues {
  typeIdentity: string;
  names: string;
  surname1: string;
  surname2?: string;
  dateBirth: string;
  status: 'ACTIVE' | 'INACTIVE';
}

/** Campos comunes a alta y edición de asociados (todo excepto numberIdentity, que no se edita). */
export function AssociateFieldset<T extends AssociateSharedFields>({
  control,
  identificationExtra,
}: {
  control: Control<T>;
  /** Campo(s) adicionales de la sección "Identificación" (el número de
   * identificación, que solo existe en el alta — en edición no se toca). */
  identificationExtra?: React.ReactNode;
}) {
  const identityTypes = useIdentityTypesQuery();

  return (
    <>
      <FormSection title="Identificación">
        {identificationExtra}
        <FormField
          control={control}
          name={'typeIdentity' as Path<T>}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tipo de identificación</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Seleccione..." />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {identityTypes.data?.map((type) => (
                    <SelectItem key={type.code} value={type.code}>
                      {type.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      </FormSection>

      <FormSection title="Datos personales">
        <FormField
          control={control}
          name={'names' as Path<T>}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nombres</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name={'surname1' as Path<T>}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Primer apellido</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name={'surname2' as Path<T>}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Segundo apellido</FormLabel>
              <FormControl>
                <Input {...field} value={field.value ?? ''} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name={'dateBirth' as Path<T>}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Fecha de nacimiento</FormLabel>
              <FormControl>
                <Input type="date" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </FormSection>

      <FormSection title="Estado del asociado">
        <FormField
          control={control}
          name={'status' as Path<T>}
          render={({ field }) => (
            <FormItem className="md:col-span-2">
              <FormLabel>Estado</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger className="w-full md:w-64">
                    <SelectValue />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="ACTIVE">Activo</SelectItem>
                  <SelectItem value="INACTIVE">Inactivo</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      </FormSection>
    </>
  );
}
