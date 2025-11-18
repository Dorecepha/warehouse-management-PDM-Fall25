import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '../../lib/axios';

const TRANSACTIONS_QUERY_KEY = ['transactions'];

export function useTransactions({ page = 1, limit = 10, search = '' } = {}) {
  return useQuery({
    queryKey: [...TRANSACTIONS_QUERY_KEY, { page, limit, search }],
    queryFn: async () => {
      const response = await api.get('/transactions/all', {
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

export function useTransaction(id) {
  return useQuery({
    queryKey: [...TRANSACTIONS_QUERY_KEY, id],
    queryFn: async () => {
      const response = await api.get(`/transactions/${id}`);
      return response.data;
    },
    enabled: Boolean(id),
  });
}

export function useTransactionsByMonth({ month, year }) {
  return useQuery({
    queryKey: [...TRANSACTIONS_QUERY_KEY, 'byMonth', { month, year }],
    queryFn: async () => {
      const response = await api.get('/transactions/by-month-year', {
        params: { month, year },
      });
      return response.data;
    },
    keepPreviousData: true,
  });
}

export function useCreateTransaction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload) => {
      const response = await api.post('/transactions', payload);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TRANSACTIONS_QUERY_KEY });
    },
  });
}

export function useUpdateTransaction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, status }) => {
      const response = await api.put(`/transactions/${id}`, status);
      return response.data;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: TRANSACTIONS_QUERY_KEY });
      queryClient.invalidateQueries({
        queryKey: [...TRANSACTIONS_QUERY_KEY, variables.id],
      });
    },
  });
}

export function useDeleteTransaction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id) => {
      const response = await api.delete(`/transactions/${id}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TRANSACTIONS_QUERY_KEY });
    },
  });
}