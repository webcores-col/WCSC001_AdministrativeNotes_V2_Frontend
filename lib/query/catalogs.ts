"use client";

import { useQuery } from "@tanstack/react-query";
import { proxyClient } from "@/lib/api/proxy-client";
import type { CatalogEntryResponseDto } from "@/lib/api/types";

/**
 * Solo lectura: alimenta selectores (p. ej. tipo de identificación en el
 * formulario de asociados). El CRUD completo de catálogos es Fase 7; esta
 * query se reutiliza tal cual desde ahí.
 */
export function useIdentityTypesQuery() {
  return useQuery({
    queryKey: ["identity-types"],
    queryFn: async () => {
      const { data } = await proxyClient<CatalogEntryResponseDto[]>(
        "/identity-types",
      );
      return data;
    },
    staleTime: 5 * 60_000,
  });
}
