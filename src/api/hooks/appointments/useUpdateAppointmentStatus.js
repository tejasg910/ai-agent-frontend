// /api/hooks/appointments/useUpdateAppointmentStatus.js
import useSWRMutation from 'swr/mutation';
import { useMemo } from 'react';
import { appointmentsApi } from '@/api/services/appointmentsApi';
import { mutate as globalMutate } from 'swr';

export const useUpdateAppointmentStatus = (id) => {
  const key = `/appointments/${id}`;
  const fetcher = useMemo(() => async (_, { arg }) => appointmentsApi.updateStatus(id, arg), [id]);
  const { trigger: mutate, isMutating: isLoading, data, error } =
    useSWRMutation(key, fetcher, {
      onSuccess: () => {
        globalMutate('/appointments');
        globalMutate(key);
      }
    });
  return { mutate, isLoading, isError: !!error, data };
};
