
// /api/hooks/slots/useCreateSlot.js
import useSWRMutation from 'swr/mutation';
import { useMemo } from 'react';
import { mutate as globalMutate } from 'swr';
import { slotApi } from '@/api/services/slotApi';

export const useCreateSlot = () => {
  const key = '/slots';
  const fetcher = useMemo(() => async (_, { arg }) => slotApi.createSlot(arg), []);
  
  const { trigger: mutate, isMutating: isLoading, data, error } = useSWRMutation(key, fetcher, {
    onSuccess: () => {
      // Invalidate relevant caches when a slot is created
      globalMutate((key) => Array.isArray(key) && key[0].startsWith('/slots'));
    }
  });
  
  return { mutate, isLoading, isError: !!error, data };
};
