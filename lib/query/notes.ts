'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { proxyClient } from '@/lib/api/proxy-client';
import type { CreateNoteDto, NoteResponseDto } from '@/lib/api/types';

export interface NotesListParams {
  page: number;
  size: number;
  associateId: string;
}

export function useNotesQuery(params: NotesListParams) {
  return useQuery({
    queryKey: ['notes', params],
    queryFn: () =>
      proxyClient<NoteResponseDto[]>('/notes', {
        query: {
          page: params.page,
          size: params.size,
          associateId: params.associateId || undefined,
        },
      }),
    placeholderData: (previousData) => previousData,
  });
}

export function useNoteQuery(id: number | undefined) {
  return useQuery({
    queryKey: ['notes', 'detail', id],
    queryFn: async () => {
      const { data } = await proxyClient<NoteResponseDto>(`/notes/${id}`);
      return data;
    },
    enabled: id !== undefined,
  });
}

export function useCreateNoteMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: CreateNoteDto) => {
      const { data } = await proxyClient<NoteResponseDto>('/notes', {
        method: 'POST',
        body: payload,
      });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
    },
  });
}

/** Eliminación lógica (F13): el backend registra quién y cuándo, ver modulos.md. */
export function useDeleteNoteMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      await proxyClient<undefined>(`/notes/${id}`, { method: 'DELETE' });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
    },
  });
}
