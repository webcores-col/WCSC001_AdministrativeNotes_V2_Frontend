"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { AssociateFieldset } from "@/components/domain/associates/AssociateFieldset";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { getErrorMessage } from "@/lib/api/error-message";
import { useCreateAssociateMutation } from "@/lib/query/associates";
import {
  createAssociateSchema,
  type CreateAssociateInput,
} from "@/lib/zod/associate.schema";

export function CreateAssociateForm() {
  const router = useRouter();
  const mutation = useCreateAssociateMutation();

  const form = useForm<CreateAssociateInput>({
    resolver: zodResolver(createAssociateSchema),
    defaultValues: {
      numberIdentity: "",
      typeIdentity: "",
      names: "",
      surname1: "",
      surname2: "",
      dateBirth: "",
      status: "ACTIVE",
    },
  });

  const onSubmit = form.handleSubmit((values) => {
    mutation.mutate(
      { ...values, surname2: values.surname2 || undefined },
      {
        onSuccess: (created) => {
          toast.success("Asociado registrado.");
          router.push(`/asociados/${created.numberIdentity}`);
        },
        onError: (error) => {
          toast.error(getErrorMessage(error));
        },
      },
    );
  });

  return (
    <Form {...form}>
      <form onSubmit={onSubmit} className="flex max-w-md flex-col gap-4" noValidate>
        <FormField
          control={form.control}
          name="numberIdentity"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Número de identificación</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <AssociateFieldset control={form.control} />
        <Button type="submit" disabled={mutation.isPending}>
          {mutation.isPending ? "Guardando…" : "Registrar asociado"}
        </Button>
      </form>
    </Form>
  );
}
