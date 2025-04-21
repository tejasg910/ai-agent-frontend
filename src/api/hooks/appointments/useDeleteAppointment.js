// /api/hooks/appointments/useDeleteAppointment.js
import useSWRMutation from 'swr/mutation';
import { useMemo } from 'react';
import { appointmentsApi } from '@/api/services/appointmentsApi';
import { mutate as globalMutate } from 'swr';

export const useDeleteAppointment = () => {
  const key = '/appointments';
  const fetcher = useMemo(() => async (_, { arg }) => appointmentsApi.remove(arg), []);
  const { trigger: mutate, isMutating: isLoading, data, error } =
    useSWRMutation(key, fetcher, {
      onSuccess: () => globalMutate(key)
    });
  return { mutate, isLoading, isError: !!error, data };
};
