import { z } from "zod";

function todayIsoDate(): string {
  return new Date().toISOString().slice(0, 10);
}

const associateFields = {
  typeIdentity: z.string().min(1, "Seleccione un tipo de identificación."),
  names: z.string().min(1, "Los nombres son obligatorios."),
  surname1: z.string().min(1, "El primer apellido es obligatorio."),
  surname2: z.string().optional(),
  dateBirth: z
    .string()
    .min(1, "La fecha de nacimiento es obligatoria.")
    .refine(
      (value) => value <= todayIsoDate(),
      "La fecha de nacimiento no puede ser futura.",
    ),
  status: z.enum(["ACTIVE", "INACTIVE"]),
};

export const createAssociateSchema = z.object({
  numberIdentity: z
    .string()
    .min(1, "El número de identificación es obligatorio."),
  ...associateFields,
});

/** El número de identificación no se edita (PK natural, ver modulos.md). */
export const updateAssociateSchema = z.object(associateFields);

export type CreateAssociateInput = z.infer<typeof createAssociateSchema>;
export type UpdateAssociateInput = z.infer<typeof updateAssociateSchema>;
