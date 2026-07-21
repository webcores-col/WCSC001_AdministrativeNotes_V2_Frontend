'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { proxyClient } from '@/lib/api/proxy-client';
import type {
  AssociateResponseDto,
  CreateAssociateDto,
  UpdateAssociateDto,
} from '@/lib/api/types';

export interface AssociatesListParams {
  page: number;
  size: number;
  search: string;
  sort: string;
}

/** `meta` trae el total para paginar (ver PageMetaDto); el detalle no lo necesita. */
export function useAssociatesQuery(params: AssociatesListParams) {
  return useQuery({
    queryKey: ['associates', params],
    queryFn: () =>
      proxyClient<AssociateResponseDto[]>('/associates', {
        query: {
          page: params.page,
          size: params.size,
          search: params.search || undefined,
          sort: params.sort,
        },
      }),
    placeholderData: (previousData) => previousData,
  });
}

export function useAssociateQuery(numberIdentity: string | undefined) {
  return useQuery({
    queryKey: ['associates', 'detail', numberIdentity],
    queryFn: async () => {
      const { data } = await proxyClient<AssociateResponseDto>(
        `/associates/${numberIdentity}`,
      );
      return data;
    },
    enabled: !!numberIdentity,
  });
}

export function useCreateAssociateMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: CreateAssociateDto) => {
      const { data } = await proxyClient<AssociateResponseDto>('/associates', {
        method: 'POST',
        body: payload,
      });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['associates'] });
    },
  });
}

export function useUpdateAssociateMutation(numberIdentity: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: UpdateAssociateDto) => {
      const { data } = await proxyClient<AssociateResponseDto>(
        `/associates/${numberIdentity}`,
        { method: 'PUT', body: payload },
      );
      return data;
    },
    onSuccess: (updated) => {
      queryClient.invalidateQueries({ queryKey: ['associates'] });
      queryClient.setQueryData(
        ['associates', 'detail', numberIdentity],
        updated,
      );
    },
  });
}
