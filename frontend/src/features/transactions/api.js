import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '../../lib/axios';

const TRANSACTIONS_QUERY_KEY = ['transactions'];
const DASHBOARD_QUERY_KEY = ['dashboard-stats'];

export function useTransactions({ page = 1, limit = 10, search = '' } = {}) {
  return useQuery({
    queryKey: [...TRANSACTIONS_QUERY_KEY, { page, limit, search }],
    queryFn: async () => {
      const response = await api.get('/transactions/all', {
        params: {
          page: Math.max(0, page - 1),
          size: limit,
          filter: search || undefined,
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

export function useTransactionsByMonth(month, year) {
  return useQuery({
    queryKey: ['transactions-by-month', { month, year }],
    queryFn: async () => {
      const response = await api.get('/transactions/by-month-year', {
        params: { month, year },
      });
      return response.data;
    },
    enabled: Boolean(month && year),
  });
}

export function usePurchaseTransaction() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload) => {
      const response = await api.post('/transactions/purchase', payload);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TRANSACTIONS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: DASHBOARD_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['transactions-by-month'] });
    },
  });
}

export function useSellTransaction() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload) => {
      const response = await api.post('/transactions/sell', payload);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TRANSACTIONS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: DASHBOARD_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['transactions-by-month'] });
    },
  });
}

export function useUpdateTransaction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, status }) => {
      const response = await api.put(
        `/transactions/${id}`,
        JSON.stringify(status),
        {
          headers: { 'Content-Type': 'application/json' },
        }
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TRANSACTIONS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: DASHBOARD_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: ['transactions-by-month'] });
    },
  });
}
