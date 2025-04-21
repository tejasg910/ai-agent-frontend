// /api/hooks/jobs/useUpdateJob.js
import useSWRMutation from 'swr/mutation';
import { useMemo } from 'react';
import { jobsApi } from '@/api/services/jobsApi';
import { mutate as globalMutate } from 'swr';

export const useUpdateJob = (id) => {
  const key = `/jobs/${id}`;
  const fetcher = useMemo(
    () => async (_, { arg }) => jobsApi.update(id, arg),
    [id]
  );
  const { trigger: mutate, isMutating: isLoading, data, error } =
    useSWRMutation(key, fetcher, {
      onSuccess: () => {
        globalMutate('/jobs');
        globalMutate(key);
      }
    });
  return { mutate, isLoading, isError: !!error, data };
};
