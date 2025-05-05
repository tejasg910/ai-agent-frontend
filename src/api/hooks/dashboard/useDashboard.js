
import { dashboardApi } from '@/api/services/dashboardApi';
import useSWR from 'swr';

export const useDashboard = (params = {}) => {
  const { data, error, isValidating: isLoading, mutate } = useSWR(
    ['/dashboard'], // dynamic key based on params
    () => dashboardApi.getAll() // fetcher gets params from key
  );
  return { mutate, isLoading, isError: !!error, data, error };
};
