import { z } from 'zod';

/**
 * Reglas de negocio (ver docs/functional/modulos.md del backend): los
 * codeudores deben ser distintos entre sí y del deudor. La combinación
 * exacta duplicada la rechaza el backend (409, UNIQUE compuesto) — no se
 * valida aquí porque requeriría una consulta extra solo para adivinar lo
 * que el propio submit ya va a confirmar.
 */
export const createNoteSchema = z
  .object({
    associateId: z.string().min(1, 'Seleccione el asociado deudor.'),
    typeNote: z.string().min(1, 'Seleccione el tipo de pagaré.'),
    codeudor1Id: z.string().optional(),
    codeudor2Id: z.string().optional(),
  })
  .refine(
    (data) => !data.codeudor1Id || data.codeudor1Id !== data.associateId,
    {
      message: 'El codeudor 1 no puede ser el mismo asociado deudor.',
      path: ['codeudor1Id'],
    },
  )
  .refine(
    (data) => !data.codeudor2Id || data.codeudor2Id !== data.associateId,
    {
      message: 'El codeudor 2 no puede ser el mismo asociado deudor.',
      path: ['codeudor2Id'],
    },
  )
  .refine(
    (data) =>
      !data.codeudor1Id ||
      !data.codeudor2Id ||
      data.codeudor1Id !== data.codeudor2Id,
    {
      message: 'Los codeudores deben ser distintos entre sí.',
      path: ['codeudor2Id'],
    },
  );

export type CreateNoteInput = z.infer<typeof createNoteSchema>;
