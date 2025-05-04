// /api/hooks/candidates/useCreateCandidate.js
import useSWRMutation from 'swr/mutation';
import { useMemo } from 'react';
import { candidatesApi } from '@/api/services/candidatesApi';
import { mutate as globalMutate } from 'swr';
import { formApi } from '@/api/services/formApi';

export const useCollectForm = () => {
  const key = '/candidates';
  const fetcher = useMemo(() => async (_, { arg }) => formApi.create(arg), []);
  const { trigger: mutate, isMutating: isLoading, data, error } =
    useSWRMutation(key, fetcher, {
      onSuccess: () => globalMutate(key)
    });
  return { mutate, isLoading, isError: !!error, data };
};
