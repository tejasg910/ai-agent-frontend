// /api/hooks/candidates/useCreateCandidate.js
import useSWRMutation from 'swr/mutation';
import { useMemo } from 'react';
import { mutate as globalMutate } from 'swr';
import { appointmentsApi } from '@/api/services/appointmentsApi';

export const useShedule = () => {
  const key = '/appointments/schedule';
  const fetcher = useMemo(() => async (_, { arg }) => appointmentsApi.shedule(arg), []);
  const { trigger: mutate, isMutating: isLoading, data, error } =
    useSWRMutation(key, fetcher, {
      onSuccess: () => globalMutate(key)
    });
  return { mutate, isLoading, isError: !!error, data };
};