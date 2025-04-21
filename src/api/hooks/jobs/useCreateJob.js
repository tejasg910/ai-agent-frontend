// /api/hooks/jobs/useCreateJob.js
import useSWRMutation from 'swr/mutation';
import { useMemo } from 'react';
import { jobsApi } from '@/api/services/jobsApi';
import { mutate as globalMutate } from 'swr';

export const useCreateJob = () => {
  const key = '/jobs';
  const fetcher = useMemo(
    () => async (_, { arg }) => jobsApi.create(arg),
    []
  );
  const { trigger: mutate, isMutating: isLoading, data, error } =
    useSWRMutation(key, fetcher, {
      onSuccess: () => globalMutate(key)
    });
  return { mutate, isLoading, isError: !!error, data };
};
