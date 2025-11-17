import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '../../lib/axios';

const SUPPLIERS_QUERY_KEY = ['suppliers'];

export function useSuppliers({ page = 1, limit = 10, search = '' } = {}) {
  return useQuery({
    queryKey: [...SUPPLIERS_QUERY_KEY, { page, limit, search }],
    queryFn: async () => {
      const response = await api.get('/suppliers', {
        params: {
          page,
          limit,
          search: search || undefined,
        },
      });
      return response.data;
    },
    keepPreviousData: true,
  });
}

export function useSupplier(id) {
  return useQuery({
    queryKey: [...SUPPLIERS_QUERY_KEY, id],
    queryFn: async () => {
      const response = await api.get(`/suppliers/${id}`);
      return response.data;
    },
    enabled: Boolean(id),
  });
}

export function useCreateSupplier() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload) => {
      const response = await api.post('/suppliers', payload);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SUPPLIERS_QUERY_KEY });
    },
  });
}

export function useUpdateSupplier() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }) => {
      const response = await api.put(`/suppliers/${id}`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SUPPLIERS_QUERY_KEY });
    },
  });
}

export function useDeleteSupplier() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id) => {
      const response = await api.delete(`/suppliers/${id}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SUPPLIERS_QUERY_KEY });
    },
  });
}
