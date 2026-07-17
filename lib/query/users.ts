"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { proxyClient } from "@/lib/api/proxy-client";
import type {
  ChangeMyPasswordDto,
  CreateUserDto,
  ResetPasswordDto,
  UpdateUserRoleDto,
  UpdateUserStatusDto,
  UserResponseDto,
} from "@/lib/api/types";

export interface UsersListParams {
  page: number;
  size: number;
  search: string;
}

/**
 * `options.enabled` permite omitir la petición (p. ej. el contador de
 * usuarios del dashboard cuando la sesión no tiene `users:read`) sin violar
 * las reglas de hooks — el hook siempre se llama, TanStack Query solo no
 * dispara el fetch.
 */
export function useUsersQuery(
  params: UsersListParams,
  options?: { enabled?: boolean },
) {
  return useQuery({
    queryKey: ["users", params],
    queryFn: () =>
      proxyClient<UserResponseDto[]>("/users", {
        query: {
          page: params.page,
          size: params.size,
          search: params.search || undefined,
        },
      }),
    enabled: options?.enabled ?? true,
    placeholderData: (previousData) => previousData,
  });
}

export function useCreateUserMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: CreateUserDto) => {
      const { data } = await proxyClient<UserResponseDto>("/users", {
        method: "POST",
        body: payload,
      });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
}

/** Cambiar mi propia contraseña (cualquier rol, exige la actual). */
export function useChangeMyPasswordMutation() {
  return useMutation({
    mutationFn: async (payload: ChangeMyPasswordDto) => {
      await proxyClient<undefined>("/users/me/password", {
        method: "PATCH",
        body: payload,
      });
    },
  });
}

/** Resetear la contraseña de otro usuario (ADMIN). */
export function useResetPasswordMutation(code: string) {
  return useMutation({
    mutationFn: async (payload: ResetPasswordDto) => {
      await proxyClient<undefined>(`/users/${code}/password`, {
        method: "PATCH",
        body: payload,
      });
    },
  });
}

/** Activar/desactivar (ADMIN; el backend rechaza el auto-cambio). */
export function useSetUserStatusMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      code,
      payload,
    }: {
      code: string;
      payload: UpdateUserStatusDto;
    }) => {
      const { data } = await proxyClient<UserResponseDto>(
        `/users/${code}/status`,
        { method: "PATCH", body: payload },
      );
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
}

/** Cambiar rol (ADMIN; revoca las sesiones del usuario, el backend rechaza el auto-cambio). */
export function useSetUserRoleMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      code,
      payload,
    }: {
      code: string;
      payload: UpdateUserRoleDto;
    }) => {
      const { data } = await proxyClient<UserResponseDto>(
        `/users/${code}/role`,
        { method: "PATCH", body: payload },
      );
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
}
