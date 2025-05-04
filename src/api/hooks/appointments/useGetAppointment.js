// /api/hooks/candidates/useGetCandidate.js
import useSWR from 'swr';
import { useMemo } from 'react';
import { appointmentsApi } from '@/api/services/appointmentsApi';

export const useGetAppointment = (id) => {
    const key = id ? `/appointments/${id}` : null;
    const fetcher = useMemo(() => () => appointmentsApi.getById(id), [id]);
    const { data, error, isValidating: isLoading, mutate } = useSWR(key, fetcher);
    return { data, isLoading, isError: !!error, mutate };
};
