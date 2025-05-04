

// /api/hooks/slots/useGenerateSlots.js
import useSWRMutation from 'swr/mutation';
import { useMemo } from 'react';
import { mutate as globalMutate } from 'swr';
import { slotApi } from '@/api/services/slotApi';

export const useGenerateSlots = () => {
  const key = '/slots/generate';
  const fetcher = useMemo(() => async (_, { arg }) => slotApi.generateSlots(arg), []);
  
  const { trigger: mutate, isMutating: isLoading, data, error } = useSWRMutation(key, fetcher, {
    onSuccess: () => {
      // Invalidate relevant caches when slots are generated
      globalMutate((key) => Array.isArray(key) && key[0].startsWith('/slots'));
    }
  });
  
  return { mutate, isLoading, isError: !!error, data };
};
