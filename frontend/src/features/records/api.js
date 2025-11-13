import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '../../lib/axios';

const RECORDS_QUERY_KEY = ['records'];

export function useRecords({ page = 1, limit = 10, search = '' } = {}) {
  return useQuery({
    queryKey: [...RECORDS_QUERY_KEY, { page, limit, search }],
    queryFn: async () => {
      const response = await api.get('/records', {
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

export function useRecord(id) {
  return useQuery({
    queryKey: [...RECORDS_QUERY_KEY, id],
    queryFn: async () => {
      const response = await api.get(`/records/${id}`);
      return response.data;
    },
    enabled: Boolean(id),
  });
}

export function useCreateRecord() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload) => {
      const response = await api.post('/records', payload);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: RECORDS_QUERY_KEY });
    },
  });
}

export function useUpdateRecord() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }) => {
      const response = await api.put(`/records/${id}`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: RECORDS_QUERY_KEY });
    },
  });
}

export function useDeleteRecord() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id) => {
      const response = await api.delete(`/records/${id}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: RECORDS_QUERY_KEY });
    },
  });
}
