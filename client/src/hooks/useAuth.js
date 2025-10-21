import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { authApi } from '../config/api';
import { QUERY_KEYS, AUTH_CHECK_INTERVAL } from '../config/constants';
import { useNavigate } from 'react-router-dom';

/**
 * Check authentication status
 * Automatically refetches every 5 minutes
 * Returns user object or null
 */
export const useAuthCheck = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.AUTH],
    queryFn: authApi.check,
    select: (data) => {
      // Extract user from standardized response
      const user = data?.data?.user || data?.user || null;

      // Sync with localStorage
      if (user) {
        localStorage.setItem('user', JSON.stringify(user));
      } else {
        localStorage.removeItem('user');
      }

      return user;
    },
    retry: false, // Don't retry if auth check fails
    refetchInterval: AUTH_CHECK_INTERVAL, // Check every 5 minutes
    refetchOnMount: true,
    initialData: () => {
      // Try to load user from localStorage on mount
      const stored = localStorage.getItem('user');
      if (stored) {
        try {
          return { data: { user: JSON.parse(stored) } };
        } catch {
          return null;
        }
      }
      return null;
    },
  });
};

/**
 * Login mutation
 */
export const useLogin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authApi.login,
    onSuccess: async (data) => {
      // Extract user from response
      const user = data?.data?.user || data?.user;

      // Update auth query cache immediately
      queryClient.setQueryData([QUERY_KEYS.AUTH], { data: { user } });

      // Store in localStorage
      if (user) {
        localStorage.setItem('user', JSON.stringify(user));
      }

      // Invalidate and refetch auth to ensure session is fully established
      await queryClient.invalidateQueries([QUERY_KEYS.AUTH]);

      // Then refetch cart with authenticated session
      await queryClient.refetchQueries([QUERY_KEYS.CART]);
    },
  });
};

/**
 * Register mutation
 */
export const useRegister = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authApi.register,
    onSuccess: async (data) => {
      // Extract user from response
      const user = data?.data?.user || data?.user;

      // Update auth query cache immediately
      queryClient.setQueryData([QUERY_KEYS.AUTH], { data: { user } });

      // Store in localStorage
      if (user) {
        localStorage.setItem('user', JSON.stringify(user));
      }

      // Invalidate and refetch auth to ensure session is fully established
      await queryClient.invalidateQueries([QUERY_KEYS.AUTH]);

      // Then refetch cart with authenticated session
      await queryClient.refetchQueries([QUERY_KEYS.CART]);
    },
  });
};

/**
 * Logout mutation
 * Clears all React Query cache and navigates to home
 */
export const useLogout = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: authApi.logout,
    onSuccess: () => {
      // Clear auth data
      queryClient.setQueryData([QUERY_KEYS.AUTH], { data: { user: null } });

      // Clear all cached queries (cart, products, etc.)
      queryClient.clear();

      // Remove from localStorage
      localStorage.removeItem('user');

      // Navigate to home
      navigate('/');
    },
    onError: () => {
      // Even if logout fails on server, clear local state
      queryClient.setQueryData([QUERY_KEYS.AUTH], { data: { user: null } });
      queryClient.clear();
      localStorage.removeItem('user');
      navigate('/');
    },
  });
};

/**
 * Helper hook to get current user
 */
export const useUser = () => {
  const { data: user, isLoading, error } = useAuthCheck();

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    error,
  };
};
