import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { coffeeApi } from '../services/api';
import { QUERY_KEYS } from '../constants/config';

/**
 * Fetch all products
 * Automatically cached for 5 minutes (staleTime)
 */
export const useProducts = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.PRODUCTS],
    queryFn: coffeeApi.getAll,
    select: (data) => {
      // Handle standardized backend response { success, message, data }
      return data?.data || data || [];
    },
  });
};

/**
 * Fetch a single product by ID
 * @param {string} id - Product ID
 */
export const useProduct = (id) => {
  return useQuery({
    queryKey: [QUERY_KEYS.PRODUCT, id],
    queryFn: () => coffeeApi.getById(id),
    select: (data) => data?.data || data,
    enabled: !!id, // Only run query if ID exists
  });
};

/**
 * Create a new product (Admin only)
 */
export const useCreateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: coffeeApi.create,
    onSuccess: () => {
      // Invalidate products list to refetch with new product
      queryClient.invalidateQueries([QUERY_KEYS.PRODUCTS]);
    },
  });
};

/**
 * Update an existing product (Admin only)
 */
export const useUpdateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => coffeeApi.update(id, data),
    onSuccess: (_, variables) => {
      // Invalidate both the product list and the specific product
      queryClient.invalidateQueries([QUERY_KEYS.PRODUCTS]);
      queryClient.invalidateQueries([QUERY_KEYS.PRODUCT, variables.id]);
    },
  });
};

/**
 * Delete a product (Admin only)
 */
export const useDeleteProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: coffeeApi.delete,
    onSuccess: () => {
      // Invalidate products list to remove deleted product
      queryClient.invalidateQueries([QUERY_KEYS.PRODUCTS]);
    },
  });
};
