// /api/hooks/candidates/useGetAllCandidates.js
import useSWR from 'swr';
import { useMemo } from 'react';
import { formApi } from '@/api/services/formApi';

export const useGetSlots = (id) => {
  const fetcher = useMemo(() => () => formApi.getSlots(id), []);
  const { data, error, isValidating: isLoading, mutate  } = useSWR('/form', fetcher);
  return { data, isLoading, isError: !!error, error,  mutate };
};
