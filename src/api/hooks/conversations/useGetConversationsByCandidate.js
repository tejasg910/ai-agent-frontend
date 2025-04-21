// /api/hooks/conversations/useGetConversationsByCandidate.js
import useSWR from 'swr';
import { useMemo } from 'react';
import { conversationsApi } from '@/api/services/conversationsApi';

export const useGetConversationsByCandidate = (cid) => {
  const key = cid ? `/conversations/${cid}` : null;
  const fetcher = useMemo(() => () => conversationsApi.getByCandidateId(cid), [cid]);
  const { data, error, isValidating: isLoading, mutate } = useSWR(key, fetcher);
  return { data, isLoading, isError: !!error, mutate };
};
