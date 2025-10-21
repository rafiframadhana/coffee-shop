import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { cartApi } from '../services/api';
import { QUERY_KEYS } from '../constants/config';
import { useAuthCheck } from './useAuth';

/**
 * Fetch user's cart
 * Returns { items, totalPrice }
 * Only fetches when user is authenticated
 */
export const useCart = () => {
  const { data: user } = useAuthCheck();

  return useQuery({
    queryKey: [QUERY_KEYS.CART],
    queryFn: cartApi.get,
    // Only run query if user is authenticated
    enabled: !!user,
    select: (data) => {
      // Handle standardized backend response
      const cartData = data?.data || data || {};
      return {
        items: cartData.items || [],
        totalPrice: cartData.totalPrice || 0,
      };
    },
    // Cart data should be fresh when user navigates back
    staleTime: 2 * 60 * 1000, // 2 minutes
    retry: (failureCount, error) => {
      // Don't retry if unauthorized (user not logged in)
      if (error?.status === 401) {
        return false;
      }
      // Retry other errors up to 3 times
      return failureCount < 3;
    },
    // Provide default data when user is not authenticated
    placeholderData: {
      items: [],
      totalPrice: 0,
    },
  });
};

/**
 * Update entire cart (add/update items)
 * Uses optimistic updates for instant UI feedback
 */
export const useUpdateCart = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: cartApi.update,
    onMutate: async (newItems) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries([QUERY_KEYS.CART]);

      // Snapshot the previous cart state
      const previousCart = queryClient.getQueryData([QUERY_KEYS.CART]);

      // Optimistically update the cart
      queryClient.setQueryData([QUERY_KEYS.CART], (old) => ({
        ...old,
        data: {
          items: newItems,
          totalPrice: old?.data?.totalPrice || 0,
        },
      }));

      // Return context object with the previous cart
      return { previousCart };
    },
    onError: (err, newItems, context) => {
      // If mutation fails, rollback to previous cart
      queryClient.setQueryData([QUERY_KEYS.CART], context.previousCart);
    },
    onSettled: () => {
      // Always refetch after mutation completes (success or error)
      queryClient.invalidateQueries([QUERY_KEYS.CART]);
    },
  });
};

/**
 * Update quantity of a specific cart item
 * Uses optimistic updates
 */
export const useUpdateCartQuantity = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ productId, quantity }) =>
      cartApi.updateQuantity(productId, quantity),
    onMutate: async ({ productId, quantity }) => {
      await queryClient.cancelQueries([QUERY_KEYS.CART]);
      const previousCart = queryClient.getQueryData([QUERY_KEYS.CART]);

      // Optimistically update quantity
      queryClient.setQueryData([QUERY_KEYS.CART], (old) => {
        if (!old?.data?.items) return old;

        const updatedItems = old.data.items.map((item) =>
          item.productId._id === productId || item.productId === productId
            ? { ...item, quantity }
            : item
        );

        return {
          ...old,
          data: {
            ...old.data,
            items: updatedItems,
          },
        };
      });

      return { previousCart };
    },
    onError: (err, variables, context) => {
      queryClient.setQueryData([QUERY_KEYS.CART], context.previousCart);
    },
    onSettled: () => {
      queryClient.invalidateQueries([QUERY_KEYS.CART]);
    },
  });
};

/**
 * Delete a specific item from cart
 * Uses optimistic updates
 */
export const useDeleteCartItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: cartApi.deleteItem,
    onMutate: async (productId) => {
      await queryClient.cancelQueries([QUERY_KEYS.CART]);
      const previousCart = queryClient.getQueryData([QUERY_KEYS.CART]);

      // Optimistically remove item
      queryClient.setQueryData([QUERY_KEYS.CART], (old) => {
        if (!old?.data?.items) return old;

        const updatedItems = old.data.items.filter(
          (item) =>
            item.productId._id !== productId && item.productId !== productId
        );

        return {
          ...old,
          data: {
            ...old.data,
            items: updatedItems,
          },
        };
      });

      return { previousCart };
    },
    onError: (err, productId, context) => {
      queryClient.setQueryData([QUERY_KEYS.CART], context.previousCart);
    },
    onSettled: () => {
      queryClient.invalidateQueries([QUERY_KEYS.CART]);
    },
  });
};

/**
 * Clear entire cart
 */
export const useClearCart = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: cartApi.clear,
    onSuccess: () => {
      // Set cart to empty immediately
      queryClient.setQueryData([QUERY_KEYS.CART], {
        data: {
          items: [],
          totalPrice: 0,
        },
      });
    },
  });
};
