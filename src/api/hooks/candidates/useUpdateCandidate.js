// /api/hooks/candidates/useUpdateCandidate.js
import useSWRMutation from 'swr/mutation';
import { useMemo } from 'react';
import { candidatesApi } from '@/api/services/candidatesApi';
import { mutate as globalMutate } from 'swr';

export const useUpdateCandidate = (id) => {
  const key = `/candidates/${id}`;
  const fetcher = useMemo(() => async (_, { arg }) => candidatesApi.update(id, arg), [id]);
  const { trigger: mutate, isMutating: isLoading, data, error } =
    useSWRMutation(key, fetcher, {
      onSuccess: () => {
        globalMutate('/candidates');
        globalMutate(key);
      }
    });
  return { mutate, isLoading, isError: !!error, data };
};
