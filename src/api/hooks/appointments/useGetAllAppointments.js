// /api/hooks/appointments/useGetAllAppointments.js
import useSWR from 'swr';
import { useMemo } from 'react';
import { appointmentsApi } from '@/api/services/appointmentsApi';

export const useGetAllAppointments = () => {
  const fetcher = useMemo(() => () => appointmentsApi.getAll(), []);
  const { data, error, isValidating: isLoading, mutate } = useSWR('/appointments', fetcher);
  return { data, isLoading, isError: !!error, mutate };
};
