
// /api/hooks/slots/useReleaseSlot.js
import useSWRMutation from 'swr/mutation';
import { useMemo } from 'react';
import { mutate as globalMutate } from 'swr';
import { slotApi } from '@/api/services/slotApi';

export const useReleaseSlot = (slotId) => {
  const key = `/slots/${slotId}/release`;
  const fetcher = useMemo(() => async () => slotApi.releaseSlot(slotId), [slotId]);
  
  const { trigger: release, isMutating: isLoading, data, error } = useSWRMutation(key, fetcher, {
    onSuccess: () => {
      // Invalidate relevant caches when a slot is released
      globalMutate((key) => Array.isArray(key) && key[0].startsWith('/slots'));
    }
  });
  
  return { release, isLoading, isError: !!error, data };
};