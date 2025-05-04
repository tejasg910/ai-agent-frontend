import useSWR from 'swr';
import { useMemo } from 'react';
import { appointmentsApi } from '@/api/services/appointmentsApi';

export const useGetAppointmentByCandidate = (id, currentPage, itemsPerPage) => {
    const key = id ? `/appointments/candidate/${id}?page=${currentPage}&limit=${itemsPerPage}` : null;
    const fetcher = useMemo(
        () => () => appointmentsApi.getByCandidateId(id, currentPage, itemsPerPage),
        [id, currentPage, itemsPerPage]
    );
    const { data, error, isValidating: isLoading, mutate } = useSWR(key, fetcher);
    return { data, isLoading, isError: !!error, mutate };
};