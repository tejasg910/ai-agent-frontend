// /api/hooks/candidates/useGetCandidate.js
import useSWR from 'swr';
import { useMemo } from 'react';
import { candidatesApi } from '@/api/services/candidatesApi';

export const useGetCandidate = (id) => {
  const key = id ? `/candidates/${id}` : null;
  const fetcher = useMemo(() => () => candidatesApi.getById(id), [id]);
  const { data, error, isValidating: isLoading, mutate } = useSWR(key, fetcher);
  return { data, isLoading, isError: !!error, mutate };
};
