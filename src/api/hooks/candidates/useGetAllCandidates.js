// /api/hooks/candidates/useGetAllCandidates.js
import useSWR from 'swr';
import { useMemo } from 'react';
import { candidatesApi } from '@/api/services/candidatesApi';

export const useGetAllCandidates = () => {
  const fetcher = useMemo(() => () => candidatesApi.getAll(), []);
  const { data, error, isValidating: isLoading, mutate } = useSWR('/candidates', fetcher);
  return { data, isLoading, isError: !!error, mutate };
};
