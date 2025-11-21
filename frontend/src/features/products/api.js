import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '../../lib/axios';

const PRODUCTS_QUERY_KEY = ['products'];

export function useProducts({ page = 1, limit = 10, search = '' } = {}) {
  return useQuery({
    queryKey: [...PRODUCTS_QUERY_KEY, { page, limit, search }],
    queryFn: async () => {
      const endpoint = search ? '/products/search' : '/products/all';
      const params = search ? { input: search } : { page, limit };

      const response = await api.get(endpoint, { params });
      return response.data;
    },
    keepPreviousData: true,
  });
}

export function useProduct(id) {
  return useQuery({
    queryKey: [...PRODUCTS_QUERY_KEY, id],
    queryFn: async () => {
      const response = await api.get(`/products/${id}`);
      return response.data;
    },
    enabled: Boolean(id),
  });
}

export function useCreateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload) => {
      const response = await api.post('/products/add', payload, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PRODUCTS_QUERY_KEY });
    },
  });
}

export function useUpdateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }) => {
      // CHANGE: Path updated to '/products/update' (No ID in URL)

      // SAFETY CHECK: Since the backend expects 'productId' in the body,
      // we ensure it's appended if the incoming data is FormData.
      if (data instanceof FormData) {
        data.append('productId', id);
      } else {
        console.error('Backend expects FormData for product updates!');
      }

      const response = await api.put('/products/update', data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PRODUCTS_QUERY_KEY });
    },
  });
}

export function useDeleteProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id) => {
      // CHANGE: Path updated to '/products/delete/${id}'
      const response = await api.delete(`/products/delete/${id}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PRODUCTS_QUERY_KEY });
    },
  });
}
