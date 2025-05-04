// /api/hooks/candidates/useCreateCandidate.js
import useSWRMutation from 'swr/mutation';
import { useMemo } from 'react';
import { mutate as globalMutate } from 'swr';
import { dashboardApi } from '@/api/services/dashboardApi';

export const useDashboard = () => {
  const key = '/dashboard';
  const fetcher = useMemo(() => async (_, { arg }) => dashboardApi.getAll(arg), []);
  const { trigger: mutate, isMutating: isLoading, data, error } =
    useSWRMutation(key, fetcher, {
      onSuccess: () => globalMutate(key)
    });
  return { mutate, isLoading, isError: !!error, data };
};
