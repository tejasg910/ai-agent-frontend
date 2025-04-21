// /api/hooks/jobs/useGetAllJobs.js
import useSWR from 'swr';
import { useMemo } from 'react';
import { jobsApi } from '@/api/services/jobsApi';

export const useGetAllJobs = () => {
  const fetcher = useMemo(() => () => jobsApi.getAll(), []);
  const { data, error, isValidating: isLoading, mutate } = useSWR('/jobs', fetcher);
  return { data, isLoading, isError: !!error, mutate };
};
