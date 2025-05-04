// /api/hooks/jobs/useGetAllJobs.js
import useSWR from 'swr';
import { jobsApi } from '@/api/services/jobsApi';

export const useGetAllJobs = (params = {}) => {
  const { data, error, isValidating: isLoading, mutate } = useSWR(
    ['/jobs', params], // dynamic key based on params
    ([, params]) => jobsApi.getAll(params) // fetcher gets params from key
  );
  return { data, isLoading, isError: !!error, mutate };
};
