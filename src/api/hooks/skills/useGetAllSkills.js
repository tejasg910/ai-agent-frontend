// /api/hooks/jobs/useGetAllJobs.js
import useSWR from 'swr';
import { useMemo } from 'react';
import { skillsApi } from '@/api/services/skillsApi';

export const useGetAllSkills = () => {
  const fetcher = useMemo(() => () => skillsApi.getAll(), []);
  const { data, error, isValidating: isLoading, mutate } = useSWR('/skills', fetcher);
  return { data, isLoading, isError: !!error, mutate };
};
