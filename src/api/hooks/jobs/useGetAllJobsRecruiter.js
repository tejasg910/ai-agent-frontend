// /api/hooks/jobs/useGetAllJobs.js
import useSWR from 'swr';
import { jobsApi } from '@/api/services/jobsApi';

export const useGetAllJobsForRecruiter = (params = {}) => {
  const { data, error, isValidating: isLoading, mutate } = useSWR(
    ['/jobs/recruiter', params], // dynamic key based on params
    ([, params]) => jobsApi.getAllRecruiter(params) // fetcher gets params from key
  );
  return { data, isLoading, isError: !!error, mutate };
};