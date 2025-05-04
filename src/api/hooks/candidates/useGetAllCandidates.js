// /api/hooks/candidates/useGetAllCandidates.js
import useSWR from 'swr';
import { useMemo } from 'react';
import { candidatesApi } from '@/api/services/candidatesApi';

export const useGetAllCandidates = (filters = {}) => {
  const { source, status, jobId, page = 1, limit = 10 } = filters;
  
  // Create a unique key based on filters for SWR cache
  const key = useMemo(() => {
    return [`/candidates`, { source, status, jobId, page, limit }];
  }, [source, status, jobId, page, limit]);
  
  // Create fetcher function that passes params to axios through our API service
  const fetcher = useMemo(() => 
    () => candidatesApi.getAll({ source, status, jobId, page, limit }), 
    [source, status, jobId, page, limit]
  );
  
  const { data, error, isValidating: isLoading, mutate } = useSWR(key, fetcher);
  
  return { 
    data: data?.candidates || [], 
    totalCounts: data?.totalCounts || { all: 0, manual: 0, form: 0 },
    pagination: {
      currentPage: data?.currentPage || 1,
      totalPages: data?.totalPages || 1,
    },
    isLoading, 
    isError: !!error, 
    mutate 
  };
};