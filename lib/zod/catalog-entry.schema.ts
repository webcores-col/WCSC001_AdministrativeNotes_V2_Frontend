import { z } from "zod";

export const createCatalogEntrySchema = z.object({
  code: z.string().min(1, "El código es obligatorio."),
  name: z.string().min(1, "El nombre es obligatorio."),
});

export type CreateCatalogEntryInput = z.infer<typeof createCatalogEntrySchema>;
