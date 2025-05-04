
// /api/hooks/slots/useSlotsByInterviewer.js
import useSWR from 'swr';
import { slotApi } from '@/api/services/slotApi';

export const useSlotsByInterviewer = (interviewerId, startDate, endDate) => {
  const key = interviewerId && startDate && endDate ? 
    [`/slots/interviewer`, interviewerId, startDate, endDate] : null;
  
  const fetcher = async () => {
    return slotApi.getSlotsByInterviewer(interviewerId, startDate, endDate);
  };
  
  const { data, error, isLoading, mutate } = useSWR(key, fetcher);
  
  return {
    slots: data?.data || [],
    isLoading,
    isError: !!error,
    mutate
  };
};