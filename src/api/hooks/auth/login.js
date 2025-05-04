// /api/hooks/appointments/useCreateAppointment.js
import useSWRMutation from 'swr/mutation';
import { useMemo } from 'react';
import { mutate as globalMutate } from 'swr';
import { authApi } from '@/api/services/authApi';

export const useLogin = () => {
  const key = '/auth';
  const fetcher = useMemo(() => async (_, { arg }) => authApi.login(arg), []);
  const { trigger: mutate, isMutating: isLoading, data, error } =
    useSWRMutation(key, fetcher, {
      onSuccess: () => globalMutate(key)
    });
  return { mutate, isLoading, isError: !!error, data };
};
