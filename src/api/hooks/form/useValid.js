// /api/hooks/candidates/useGetAllCandidates.js
import useSWR from 'swr';
import { useMemo } from 'react';
import { formApi } from '@/api/services/formApi';

export const useValid = (id) => {
    const fetcher = useMemo(() => () => formApi.checkValid(id), []);
    const { data, error, isValidating: isLoading, mutate } = useSWR('/check-valid', fetcher);
    return { data, isLoading, isError: !!error, mutate };
};
