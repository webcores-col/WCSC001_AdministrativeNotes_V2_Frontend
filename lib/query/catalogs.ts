"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { proxyClient } from "@/lib/api/proxy-client";
import type {
  CatalogEntryResponseDto,
  CreateCatalogEntryDto,
} from "@/lib/api/types";

export interface CatalogHooks {
  useList: () => ReturnType<typeof useQuery<CatalogEntryResponseDto[]>>;
  useCreate: () => ReturnType<
    typeof useMutation<CatalogEntryResponseDto, unknown, CreateCatalogEntryDto>
  >;
  useDelete: () => ReturnType<typeof useMutation<void, unknown, string>>;
}

/**
 * `identity-types` y `note-types` son estructuralmente idénticos (código +
 * nombre, solo ADMIN crea/elimina, 409 si hay registros dependientes) — un
 * único factory evita duplicar la misma lógica de query/mutación dos veces.
 */
function createCatalogHooks(basePath: string, queryKey: string): CatalogHooks {
  function useList() {
    return useQuery({
      queryKey: [queryKey],
      queryFn: async () => {
        const { data } = await proxyClient<CatalogEntryResponseDto[]>(basePath);
        return data;
      },
      staleTime: 5 * 60_000,
    });
  }

  function useCreate() {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: async (payload: CreateCatalogEntryDto) => {
        const { data } = await proxyClient<CatalogEntryResponseDto>(basePath, {
          method: "POST",
          body: payload,
        });
        return data;
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: [queryKey] });
      },
    });
  }

  function useDelete() {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: async (code: string) => {
        await proxyClient<undefined>(`${basePath}/${code}`, {
          method: "DELETE",
        });
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: [queryKey] });
      },
    });
  }

  return { useList, useCreate, useDelete };
}

export const identityTypeHooks = createCatalogHooks(
  "/identity-types",
  "identity-types",
);
export const noteTypeHooks = createCatalogHooks("/note-types", "note-types");

/** Solo lectura: alimenta el selector de tipo de identificación en el formulario de asociados (Fase 5). */
export const useIdentityTypesQuery = identityTypeHooks.useList;
/** Solo lectura: alimenta el selector de tipo de pagaré en el formulario de pagarés (Fase 6). */
export const useNoteTypesQuery = noteTypeHooks.useList;
