import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { userApi } from '../services/api';
import { QUERY_KEYS } from '../constants/config';

/**
 * Fetch all users (Admin only)
 */
export const useUsers = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.USERS],
    queryFn: userApi.getAll,
    select: (data) => data?.data || data || [],
  });
};

/**
 * Fetch a single user by ID (Admin only)
 */
export const useUser = (id) => {
  return useQuery({
    queryKey: [QUERY_KEYS.USERS, id],
    queryFn: () => userApi.getById(id),
    select: (data) => data?.data || data,
    enabled: !!id,
  });
};

/**
 * Update user (Admin only)
 */
export const useUpdateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => userApi.update(id, data),
    onSuccess: (_, variables) => {
      // Invalidate users list and specific user
      queryClient.invalidateQueries([QUERY_KEYS.USERS]);
      if (variables.id) {
        queryClient.invalidateQueries([QUERY_KEYS.USERS, variables.id]);
      }
    },
  });
};

/**
 * Delete user (Admin only)
 */
export const useDeleteUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: userApi.delete,
    onSuccess: () => {
      // Invalidate users list
      queryClient.invalidateQueries([QUERY_KEYS.USERS]);
    },
  });
};
