// /api/hooks/conversations/useCreateConversation.js
import useSWRMutation from 'swr/mutation';
import { useMemo } from 'react';
import { conversationsApi } from '@/api/services/conversationsApi';
import { mutate as globalMutate } from 'swr';

export const useCreateConversation = () => {
  const key = '/conversations';
  const fetcher = useMemo(() => async (_, { arg }) => conversationsApi.create(arg), []);
  const { trigger: mutate, isMutating: isLoading, data, error } =
    useSWRMutation(key, fetcher, {
      onSuccess: () => globalMutate(key)
    });
  return { mutate, isLoading, isError: !!error, data };
};
