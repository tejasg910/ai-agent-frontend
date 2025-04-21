// /api/hooks/candidates/useCreateCandidate.js
import useSWRMutation from 'swr/mutation';
import { useMemo } from 'react';
import { candidatesApi } from '@/api/services/candidatesApi';
import { mutate as globalMutate } from 'swr';

export const useCreateCandidate = () => {
  const key = '/candidates';
  const fetcher = useMemo(() => async (_, { arg }) => candidatesApi.create(arg), []);
  const { trigger: mutate, isMutating: isLoading, data, error } =
    useSWRMutation(key, fetcher, {
      onSuccess: () => globalMutate(key)
    });
  return { mutate, isLoading, isError: !!error, data };
};
