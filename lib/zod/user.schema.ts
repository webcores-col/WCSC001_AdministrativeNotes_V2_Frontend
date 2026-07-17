import { z } from "zod";

/** Ver docs/functional/modulos.md del backend: mínimo 8 caracteres, letras y números. */
const passwordSchema = z
  .string()
  .min(8, "Mínimo 8 caracteres.")
  .regex(/[A-Za-z]/, "Debe incluir al menos una letra.")
  .regex(/[0-9]/, "Debe incluir al menos un número.");

export const ROLES = ["ADMIN", "OPERATOR", "VIEWER"] as const;

export const createUserSchema = z.object({
  code: z.string().min(1, "El código es obligatorio."),
  names: z.string().min(1, "Los nombres son obligatorios."),
  surnames: z.string().min(1, "Los apellidos son obligatorios."),
  username: z.string().min(1, "El usuario es obligatorio."),
  password: passwordSchema,
  role: z.enum(ROLES),
});

export type CreateUserInput = z.infer<typeof createUserSchema>;

export const resetPasswordSchema = z.object({
  newPassword: passwordSchema,
});

export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;

export const changeMyPasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Ingrese su contraseña actual."),
    newPassword: passwordSchema,
    confirmPassword: z.string().min(1, "Confirme la nueva contraseña."),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Las contraseñas no coinciden.",
    path: ["confirmPassword"],
  });

export type ChangeMyPasswordInput = z.infer<typeof changeMyPasswordSchema>;
