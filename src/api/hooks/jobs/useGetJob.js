// /api/hooks/jobs/useGetJob.js
import useSWR from 'swr';
import { useMemo } from 'react';
import { jobsApi } from '@/api/services/jobsApi';

export const useGetJob = (id) => {
  const key = id ? `/jobs/${id}` : null;
  const fetcher = useMemo(() => () => jobsApi.getById(id), [id]);
  const { data, error, isValidating: isLoading, mutate } = useSWR(key, fetcher);
  return { data, isLoading, isError: !!error, mutate };
};
