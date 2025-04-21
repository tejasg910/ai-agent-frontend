// /api/hooks/appointments/useCreateAppointment.js
import useSWRMutation from 'swr/mutation';
import { useMemo } from 'react';
import { appointmentsApi } from '@/api/services/appointmentsApi';
import { mutate as globalMutate } from 'swr';

export const useCreateAppointment = () => {
  const key = '/appointments';
  const fetcher = useMemo(() => async (_, { arg }) => appointmentsApi.create(arg), []);
  const { trigger: mutate, isMutating: isLoading, data, error } =
    useSWRMutation(key, fetcher, {
      onSuccess: () => globalMutate(key)
    });
  return { mutate, isLoading, isError: !!error, data };
};
